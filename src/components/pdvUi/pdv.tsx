"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Search, CreditCard, AlertCircle, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CartItem, Product } from "./types"
import { PdvHeader } from "./pdv-header"
import { PdvSidebar } from "./pdv-sidebar"
import { PdvTable } from "./pdv-table"
import { PdvFooter } from "./pdv-footer"

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    code: "7891234567890",
    name: "Coca-Cola 2L",
    price: 9.99,
    stock: 48,
  },
  {
    id: "2",
    code: "7890000001234",
    name: "Arroz Tipo 1 5kg",
    price: 24.9,
    stock: 12,
  },
  {
    id: "3",
    code: "7890000005678",
    name: "Feijão Carioca 1kg",
    price: 8.5,
    stock: 30,
  },
  {
    id: "4",
    code: "7890000009012",
    name: "Óleo de Soja 900ml",
    price: 7.49,
    stock: 20,
  },
  {
    id: "5",
    code: "1111111111111",
    name: "Sabão em Pó 1kg",
    price: 13.9,
    stock: 15,
  },
]

const fmt = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export default function PDVPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [code, setCode] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedRow, setSelectedRow] = useState<number | null>(null)
  const [received, setReceived] = useState("")
  const [showFinish, setShowFinish] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notification, setNotification] = useState<{
    msg: string
    type: "ok" | "err"
  } | null>(null)
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null)

  const notify = useCallback((msg: string, type: "ok" | "err" = "ok") => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 2200)
  }, [])

  const addProduct = useCallback(
    (product: Product, qty = 1) => {
      setCart((prev) => {
        const idx = prev.findIndex((item) => item.id === product.id)
        if (idx >= 0) {
          const updated = [...prev]
          updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty }
          setLastAdded(updated[idx])
          setSelectedRow(idx)
          return updated
        }

        const newItem: CartItem = { ...product, qty, discount: 0 }
        setLastAdded(newItem)
        setSelectedRow(prev.length)
        return [...prev, newItem]
      })
      notify(`${product.name} adicionado`)
    },
    [notify]
  )

  const handleCodeSubmit = useCallback(() => {
    if (!code.trim()) return

    const found = MOCK_PRODUCTS.find((product) => product.code === code.trim())
    if (found) {
      addProduct(found)
    } else {
      notify("Produto não encontrado", "err")
    }
    setCode("")
  }, [code, addProduct, notify])

  const removeItem = useCallback((idx: number) => {
    setCart((prev) => {
      const updated = prev.filter((_, i) => i !== idx)
      setSelectedRow(
        updated.length > 0 ? Math.min(idx, updated.length - 1) : null
      )
      return updated
    })
  }, [])

  const changeQty = useCallback((idx: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev]
      const newQty = updated[idx].qty + delta
      if (newQty <= 0) {
        const next = prev.filter((_, i) => i !== idx)
        setSelectedRow(next.length > 0 ? Math.min(idx, next.length - 1) : null)
        return next
      }
      updated[idx] = { ...updated[idx], qty: newQty }
      setLastAdded(updated[idx])
      return updated
    })
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName

      if (e.key === "F2") {
        e.preventDefault()
        setShowSearch(true)
        return
      }

      if (e.key === "F5") {
        e.preventDefault()
        if (cart.length > 0) setShowFinish(true)
        return
      }

      if (e.key === "Escape") {
        if (!showFinish && !showSearch) {
          e.preventDefault()
          inputRef.current?.focus()
        }
        return
      }

      if (tag === "INPUT" || tag === "TEXTAREA") return

      if (e.key === "F3" && selectedRow !== null) {
        e.preventDefault()
        changeQty(selectedRow, 1)
        return
      }

      if (e.key === "F4" && selectedRow !== null) {
        e.preventDefault()
        changeQty(selectedRow, -1)
        return
      }

      if (e.key === "Delete" && selectedRow !== null) {
        e.preventDefault()
        removeItem(selectedRow)
        return
      }

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedRow((current) =>
          current === null ? 0 : Math.min(current + 1, cart.length - 1)
        )
        return
      }

      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedRow((current) =>
          current === null ? 0 : Math.max(current - 1, 0)
        )
        return
      }
    }

    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [cart, selectedRow, showFinish, showSearch, changeQty, removeItem])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)
  const receivedNum = parseFloat(received.replace(",", ".")) || 0
  const change = receivedNum - subtotal

  const filteredProducts = useMemo(
    () =>
      MOCK_PRODUCTS.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.code.includes(searchQuery)
      ),
    [searchQuery]
  )

  useEffect(() => {
    if (showSearch) {
      searchInputRef.current?.focus()
    }
  }, [showSearch])

  useEffect(() => {
    if (!showSearch && !showFinish) {
      inputRef.current?.focus()
    }
  }, [showSearch, showFinish])

  const featured = lastAdded

  return (
    <TooltipProvider delayDuration={300}>
      <div className="relative flex h-[calc(100dvh-4rem)] flex-col overflow-hidden bg-background">
        {notification && (
          <div
            className={cn(
              "absolute top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg transition-all",
              notification.type === "ok"
                ? "bg-emerald-500 text-white"
                : "text-destructive-foreground bg-destructive"
            )}
          >
            {notification.type === "ok" ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {notification.msg}
          </div>
        )}

        <PdvHeader
          inputRef={inputRef}
          code={code}
          setCode={setCode}
          onSubmit={handleCodeSubmit}
          onOpenSearch={() => setShowSearch(true)}
          onOpenFinish={() => setShowFinish(true)}
          finishDisabled={cart.length === 0}
        />

        <div className="flex flex-1 gap-0 overflow-hidden">
          <PdvSidebar
            featured={featured}
            totalItems={totalItems}
            cartLength={cart.length}
            subtotal={subtotal}
          />

          <main className="flex flex-1 flex-col overflow-hidden">
            <PdvTable
              cart={cart}
              selectedRow={selectedRow}
              onSelectRow={setSelectedRow}
              changeQty={changeQty}
              removeItem={removeItem}
            />

            <PdvFooter
              received={received}
              setReceived={setReceived}
              subtotal={subtotal}
              change={change}
              cartLength={cart.length}
            />
          </main>
        </div>
      </div>

      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Buscar Produto
            </DialogTitle>
          </DialogHeader>

          <Input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nome ou código do produto..."
            className="mt-1"
          />

          <div className="mt-2 h-56">
            <div className="space-y-1 overflow-y-auto pr-2">
              {filteredProducts.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum produto encontrado
                </p>
              ) : (
                filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-muted"
                    onClick={() => {
                      addProduct(product)
                      setShowSearch(false)
                      setSearchQuery("")
                      inputRef.current?.focus()
                    }}
                  >
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.code}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {fmt(product.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.stock} em estoque
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFinish} onOpenChange={setShowFinish}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Finalizar Venda
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 rounded-xl bg-muted/50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total de itens</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Recebido</span>
              <span className="font-medium">
                {receivedNum > 0 ? fmt(receivedNum) : "—"}
              </span>
            </div>
            {receivedNum > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Troco</span>
                <span
                  className={cn(
                    "font-medium",
                    change < 0 ? "text-destructive" : "text-emerald-600"
                  )}
                >
                  {fmt(Math.max(change, 0))}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-lg text-primary">{fmt(subtotal)}</span>
            </div>
          </div>

          <DialogFooter className="mt-2 gap-2">
            <Button variant="outline" onClick={() => setShowFinish(false)}>
              Cancelar
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={() => {
                setCart([])
                setReceived("")
                setSelectedRow(null)
                setLastAdded(null)
                setShowFinish(false)
                notify("Venda finalizada com sucesso!")
                inputRef.current?.focus()
              }}
            >
              <Check className="h-4 w-4" />
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
