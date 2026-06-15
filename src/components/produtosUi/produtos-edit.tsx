import { useEditProdutoStore } from "@/stores/edit-produto"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useMask } from "@react-input/mask"
import Cropper, { type Area } from "react-easy-crop"
import { toast } from "sonner"
import * as z from "zod"
import { invoke } from '@tauri-apps/api/core';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Slider } from "@/components/ui/slider"
import { db } from "@/db"
import { produtosTable } from "@/db/schema/produto"
import { eq } from "drizzle-orm"

// ---------------------------------------------------------------------------
// Helpers — refs
// ---------------------------------------------------------------------------

function mergeRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node)
      } else if (ref && typeof ref === "object") {
        ;(ref as React.MutableRefObject<T | null>).current = node
      }
    })
  }
}

// ---------------------------------------------------------------------------
// Helpers — moeda (centavos)
//
// O banco armazena inteiros em centavos: R$ 19,90 → 1990
//
// Usamos Intl.NumberFormat em vez de máscara estática porque o comprimento
// varia (R$ 1,00 / R$ 100,00 / R$ 1.000,00) e @react-input/mask não suporta
// máscaras dinâmicas.
// ---------------------------------------------------------------------------

/**
 * Formata centavos para exibição: 1990 → "R$ 19,90"
 */
function formatCents(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100)
}

/**
 * "R$ 1.299,90" → 129990  |  "19,90" → 1990  |  "" → undefined
 * Strip de tudo exceto dígitos — o Intl já garante que os dois últimos
 * dígitos são os centavos.
 */
function parseCurrencyToCents(display: string): number | undefined {
  const digits = display.replace(/\D/g, "")
  return digits === "" ? undefined : Number(digits)
}

// ---------------------------------------------------------------------------
// Helpers — canvas crop
// ---------------------------------------------------------------------------

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })

async function getCroppedBlob(imageSrc: string, cropArea: Area): Promise<Blob> {
  const img = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  canvas.width = cropArea.width
  canvas.height = cropArea.height
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(
    img,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height
  )
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas vazio"))),
      "image/jpeg",
      0.92
    )
  )
}

// ---------------------------------------------------------------------------
// Helpers — Uint16Array → data URL
//
// O banco retorna os bytes da imagem como Uint16Array (ou Buffer/Uint8Array).
// Convertemos para uma data URL base64 para exibir no <img> e no Cropper.
// ---------------------------------------------------------------------------

function uint16ArrayToDataURL(
  data: Uint16Array | Uint8Array,
  mime = "image/jpeg"
): string {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data.buffer)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return `data:${mime};base64,${btoa(binary)}`
}

// ---------------------------------------------------------------------------
// ImageCropField
// ---------------------------------------------------------------------------

interface ImageCropFieldProps {
  value: Blob | undefined
  onChange: (blob: Blob | undefined) => void
  invalid?: boolean
  /** Bytes da imagem já salva no banco (Uint16Array vindo do store). */
  initialImage?: Uint16Array | Uint8Array | null
}

function ImageCropField({
  value,
  onChange,
  invalid,
  initialImage,
}: ImageCropFieldProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Converte os bytes do banco para data URL UMA única vez
  const initialDataUrl = React.useMemo(
    () => (initialImage ? uint16ArrayToDataURL(initialImage) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // intencional: initialImage não muda durante a sessão de edição
  )

  const [rawSrc, setRawSrc] = React.useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(() => {
    if (value) return URL.createObjectURL(value)
    return initialDataUrl
  })

  const createdUrls = React.useRef<string[]>([])
  const trackUrl = (url: string) => {
    createdUrls.current.push(url)
    return url
  }

  React.useEffect(() => {
    return () => {
      createdUrls.current.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [])

  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(
    null
  )
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  function openCropperWithFile(file: File) {
    if (rawSrc) URL.revokeObjectURL(rawSrc)
    setRawSrc(trackUrl(URL.createObjectURL(file)))
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setDialogOpen(true)
  }

  function openCropperWithExistingSrc(src: string) {
    setRawSrc(src)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setDialogOpen(true)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    openCropperWithFile(file)
    e.target.value = ""
  }

  async function handleConfirmCrop() {
    if (!rawSrc || !croppedAreaPixels) return
    setSaving(true)
    try {
      const blob = await getCroppedBlob(rawSrc, croppedAreaPixels)
      setPreviewUrl(trackUrl(URL.createObjectURL(blob)))
      onChange(blob)
      setDialogOpen(false)
    } catch {
      toast.error("Erro ao recortar imagem. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  function handleRemove() {
    setPreviewUrl(null)
    onChange(undefined)
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-invalid={invalid}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        className={[
          "relative flex h-40 w-full cursor-pointer flex-col items-center justify-center",
          "rounded-lg border-2 border-dashed transition-colors select-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          invalid
            ? "border-destructive bg-destructive/5 hover:bg-destructive/10"
            : "border-border bg-muted/40 hover:bg-muted/70",
        ].join(" ")}
      >
        {previewUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview do produto"
              className="h-full w-full rounded-[calc(0.5rem-2px)] object-cover"
            />
            <div className="absolute inset-0 flex items-end justify-end gap-1 rounded-[calc(0.5rem-2px)] bg-black/30 p-2 opacity-0 transition-opacity hover:opacity-100">
              <button
                type="button"
                aria-label="Recortar imagem"
                onClick={(e) => {
                  e.stopPropagation()
                  openCropperWithExistingSrc(previewUrl)
                }}
                className="rounded bg-background/90 px-2 py-1 text-xs font-medium shadow transition-colors hover:bg-background"
              >
                ✂ Recortar
              </button>
              <button
                type="button"
                aria-label="Remover imagem"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
                className="rounded bg-background/90 px-2 py-1 text-xs font-medium shadow transition-colors hover:bg-background"
              >
                ✕ Remover
              </button>
            </div>
          </>
        ) : (
          <div className="pointer-events-none flex flex-col items-center gap-1.5 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <span className="text-sm font-medium">Selecionar imagem</span>
            <span className="text-xs">JPG, PNG ou WebP</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recortar imagem (1:1)</DialogTitle>
          </DialogHeader>
          <div className="relative h-72 w-full overflow-hidden rounded-lg bg-black">
            {rawSrc && (
              <Cropper
                image={rawSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_area, pixels) => setCroppedAreaPixels(pixels)}
              />
            )}
          </div>
          <div className="flex items-center gap-3 px-1">
            <span className="w-8 shrink-0 text-xs text-muted-foreground">
              Zoom
            </span>
            <Slider
              min={1}
              max={3}
              step={0.05}
              value={[zoom]}
              onValueChange={([v]) => setZoom(v)}
              className="flex-1"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmCrop}
              disabled={saving || !croppedAreaPixels}
            >
              {saving ? "Aguarde…" : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

export const produtoSchema = z.object({
  id: z.number().int().positive().optional(),
  description: z.string().min(1, "A descrição é obrigatória"),
  sku: z.string().min(1, "O SKU é obrigatório"),
  image: z
    .instanceof(Blob, { message: "A imagem deve ser um Blob" })
    .optional().refine(async (value) => {
    if (value) {
      // 1. Converte o Blob para um ArrayBuffer
      const arrayBuffer = await value.arrayBuffer();
      
      // 2. Transforma em um Uint8Array (que o Tauri aceita como Vec<u8>)
      const uint8Array = new Uint8Array(arrayBuffer);

      // 3. Passa a sequência de bytes para o comando Rust
      const response = await invoke("compress_image", {
        image: Array.from(uint8Array) // Converte para array comum se necessário, ou passe o uint8Array direto dependendo da versão do Tauri
      });

      return response;
    }
    return true; // Importante para validações do Zod que passam se for opcional/vazio
  }),
  precoCusto: z.number().int().min(0).optional(),
  precoVenda: z.number().int().min(0).optional(),
  markup: z.number().int().min(0).max(999).nullable().optional(),
})

type ProdutoFormValues = z.infer<typeof produtoSchema>

// Markup: máscara estática funciona (comprimento fixo: até 3 dígitos + " %")
const MARKUP_MASK = "___ %"
const MARKUP_REPLACE = { _: /\d/ }

const DESCRIPTION_MAX = 300

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function ProdutosEdit() {
  const { produto } = useEditProdutoStore()

  const form = useForm<ProdutoFormValues>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      id: produto?.id,
      description: produto?.description ?? "",
      sku: produto?.sku ?? "",
      precoCusto: produto?.precoCusto ?? undefined,
      precoVenda: produto?.precoVenda ?? undefined,
      markup: produto?.markup ?? null,
    },
  })

  // ── Markup automático ────────────────────────────────────────────────────
  // markup = round(((precoVenda - precoCusto) / precoCusto) * 100)
  const [precoCusto, precoVenda] = useWatch({
    control: form.control,
    name: ["precoCusto", "precoVenda"],
  })

  const markupInputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    if (precoCusto != null && precoVenda != null && precoCusto > 0) {
      const raw = Math.round(((precoVenda - precoCusto) / precoCusto) * 100)
      const clamped = Math.max(0, Math.min(999, raw))
      form.setValue("markup", clamped, {
        shouldValidate: true,
        shouldDirty: true,
      })
      if (markupInputRef.current) {
        markupInputRef.current.value = clamped > 0 ? `${clamped} %` : ""
      }
    }
  }, [precoCusto, precoVenda, form])

  // Markup usa useMask (comprimento fixo) — preços usam Intl (comprimento variável)
  const markupMaskRef = useMask({
    mask: MARKUP_MASK,
    replacement: MARKUP_REPLACE,
  })

  async function onSubmit(data: ProdutoFormValues) {
    try {
      await db
        .update(produtosTable)
        .set({
          ...data,
        })
        .where(eq(produtosTable.id, data.id || 0))

      toast("Produto atualizado com sucesso!", {
        description: (
          <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
            <code>
              {JSON.stringify(
                { ...data, image: data.image ? "[Blob]" : undefined },
                null,
                2
              )}
            </code>
          </pre>
        ),
        position: "bottom-right",
        classNames: { content: "flex flex-col gap-2" },
        style: {
          "--border-radius": "calc(var(--radius) + 4px)",
        } as React.CSSProperties,
      })
    } catch (error) {
      toast.error("Ocorreu um erro ao editar produto")
    }
  }

  return (
    <div className="flex w-full items-center justify-center">
      <Card className="w-full sm:max-w-lg">
        <CardHeader>
          <CardTitle>Editar Produto</CardTitle>
          <CardDescription>
            Atualize as informações do produto cadastrado.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="form-edit-produto" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* ── Imagem ──────────────────────────────────────────────── */}
              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Imagem do Produto</FieldLabel>
                    <ImageCropField
                      value={field.value}
                      onChange={field.onChange}
                      invalid={fieldState.invalid}
                      initialImage={
                        (produto?.image as Uint16Array | undefined) ?? null
                      }
                    />
                    <FieldDescription>
                      Imagem quadrada (1:1). Clique para trocar, passe o mouse
                      para recortar.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* ── SKU ─────────────────────────────────────────────────── */}
              <Controller
                name="sku"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-edit-produto-sku">SKU</FieldLabel>
                    <Input
                      {...field}
                      id="form-edit-produto-sku"
                      aria-invalid={fieldState.invalid}
                      placeholder="PROD-001"
                      autoComplete="off"
                    />
                    <FieldDescription>
                      Código único de identificação do produto.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* ── Descrição ───────────────────────────────────────────── */}
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-edit-produto-description">
                      Descrição
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="form-edit-produto-description"
                        placeholder="Descreva o produto detalhadamente..."
                        rows={4}
                        maxLength={DESCRIPTION_MAX}
                        className="min-h-24 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.value.length}/{DESCRIPTION_MAX} caracteres
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldDescription>
                      Inclua materiais, dimensões e características relevantes.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* ── Preço de Custo ──────────────────────────────────────── */}
              <Controller
                name="precoCusto"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-edit-produto-precoCusto">
                      Preço de Custo
                    </FieldLabel>
                    <Input
                      ref={field.ref}
                      id="form-edit-produto-precoCusto"
                      name={field.name}
                      inputMode="numeric"
                      aria-invalid={fieldState.invalid}
                      placeholder="R$ 0,00"
                      onBlur={field.onBlur}
                      defaultValue={
                        field.value != null ? formatCents(field.value) : ""
                      }
                      onChange={(e) => {
                        const cents = parseCurrencyToCents(e.target.value)
                        field.onChange(cents)
                        e.target.value = cents != null ? formatCents(cents) : ""
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* ── Preço de Venda ──────────────────────────────────────── */}
              <Controller
                name="precoVenda"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-edit-produto-precoVenda">
                      Preço de Venda
                    </FieldLabel>
                    <Input
                      ref={field.ref}
                      id="form-edit-produto-precoVenda"
                      name={field.name}
                      inputMode="numeric"
                      aria-invalid={fieldState.invalid}
                      placeholder="R$ 0,00"
                      onBlur={field.onBlur}
                      defaultValue={
                        field.value != null ? formatCents(field.value) : ""
                      }
                      onChange={(e) => {
                        const cents = parseCurrencyToCents(e.target.value)
                        field.onChange(cents)
                        e.target.value = cents != null ? formatCents(cents) : ""
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* ── Markup ── calculado automaticamente ─────────────────── */}
              <Controller
                name="markup"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-edit-produto-markup">
                      Markup
                    </FieldLabel>
                    <Input
                      id="form-edit-produto-markup"
                      ref={mergeRefs(field.ref, markupMaskRef, (node) => {
                        markupInputRef.current = node
                      })}
                      name={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="0 %"
                      onBlur={field.onBlur}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "")
                        field.onChange(digits === "" ? null : Number(digits))
                      }}
                      defaultValue={
                        field.value != null ? `${field.value} %` : ""
                      }
                    />
                    <FieldDescription>
                      Calculado automaticamente a partir dos preços. Editável
                      manualmente.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Cancelar
            </Button>
            <Button type="submit" form="form-edit-produto">
              Salvar
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  )
}
