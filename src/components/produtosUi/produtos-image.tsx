import * as React from "react"
import Cropper, { type Area } from "react-easy-crop"
import { ImagePlus, Trash2, Crop } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"

interface ImageUploadCropProps {
  value?: Blob
  onChange: (image?: Blob) => void
  initialImage?: Uint8Array | Uint16Array | null
  aspect?: number
  label?: string
}

function uint8ArrayToDataUrl(data: Uint16Array | Uint8Array, mime = "image/jpeg") {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data.buffer)
  let binary = ""

  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }

  return `data:${mime};base64,${btoa(binary)}`
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })

async function getCroppedBlob(imageSrc: string, cropArea: Area): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  canvas.width = cropArea.width
  canvas.height = cropArea.height

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Não foi possível criar contexto do canvas")
  }

  ctx.drawImage(
    image,
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
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error("Falha ao gerar imagem recortada"))
      }
    }, "image/jpeg", 0.92)
  )
}

export default function ProdutosImage({
  value,
  onChange,
  initialImage = null,
  aspect = 1,
  label = "Imagem do produto",
}: ImageUploadCropProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [rawSrc, setRawSrc] = React.useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(() => {
    if (value) return URL.createObjectURL(value)
    if (initialImage) return uint8ArrayToDataUrl(initialImage)
    return null
  })
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null)
  const [saving, setSaving] = React.useState(false)

  const createdUrls = React.useRef<string[]>([])

  const trackUrl = React.useCallback((url: string) => {
    createdUrls.current.push(url)
    return url
  }, [])

  React.useEffect(() => {
    if (value) {
      setPreviewUrl(URL.createObjectURL(value))
    }

    return () => {
      createdUrls.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [value])

  const openFileDialog = () => fileInputRef.current?.click()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (rawSrc) {
      URL.revokeObjectURL(rawSrc)
    }

    setRawSrc(trackUrl(URL.createObjectURL(file)))
    setDialogOpen(true)
    event.target.value = ""
  }

  const handleConfirmCrop = async () => {
    if (!rawSrc || !croppedAreaPixels) return

    setSaving(true)
    try {
      const blob = await getCroppedBlob(rawSrc, croppedAreaPixels)
      const preview = trackUrl(URL.createObjectURL(blob))
      setPreviewUrl(preview)
      onChange(blob)
      setDialogOpen(false)
    } catch {
      onChange(undefined)
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    onChange(undefined)
  }

  return (
    <div className="space-y-3">
      <Field>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">{label}</span>
          <div className="flex items-center gap-2">
            {previewUrl && (
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleRemove}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button type="button" variant="secondary" onClick={openFileDialog}>
              <ImagePlus className="h-4 w-4" />
              Selecionar
            </Button>
          </div>
        </div>
      </Field>

      <div
        role="button"
        tabIndex={0}
        onClick={openFileDialog}
        onKeyDown={(event) => event.key === "Enter" && openFileDialog()}
        className="group relative flex min-h-45 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted px-4 py-5 text-center transition hover:border-primary/80 hover:bg-muted/90"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview da imagem"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImagePlus className="h-8 w-8" />
            <span className="text-sm font-medium">Clique para selecionar ou arraste a imagem</span>
            <span className="text-xs">JPG, PNG ou WebP</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger className="sr-only">Abrir cropper</DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Recortar imagem</DialogTitle>
          </DialogHeader>

          <div className="relative h-105 w-full overflow-hidden rounded-xl bg-black">
            {rawSrc && (
              <Cropper
                image={rawSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_croppedArea, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
              />
            )}
          </div>

          <div className="mt-4 flex items-center gap-4">
            <Crop className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Ajuste posição e zoom antes de confirmar.</span>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleConfirmCrop} disabled={saving || !croppedAreaPixels}>
              {saving ? "Salvando..." : "Aplicar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
