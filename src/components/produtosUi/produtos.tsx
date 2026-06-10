"use client"

import { useMemo, useState } from "react"
import { ProdutosToolbar } from "./produtos-toolbar"
import { ProdutosTable } from "./produtos-table"
import { ProdutosDialog } from "./produtos-dialog"
import type { Product } from "./types"

const INITIAL_PRODUCTS: Product[] = [
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

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        [product.name, product.code].some((value) =>
          value.toLowerCase().includes(search.toLowerCase())
        )
      ),
    [products, search]
  )

  const resetForm = () => {
    setEditing(null)
    setCode("")
    setName("")
    setPrice("")
    setStock("")
  }

  const openNewProduct = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEditProduct = (product: Product) => {
    setEditing(product)
    setCode(product.code)
    setName(product.name)
    setPrice(product.price.toString())
    setStock(product.stock.toString())
    setDialogOpen(true)
  }

  const closeDialog = () => {
    resetForm()
    setDialogOpen(false)
  }

  const saveProduct = () => {
    const normalizedPrice = Number(price.replace(",", "."))
    const normalizedStock = Number(stock)
    if (
      !code.trim() ||
      !name.trim() ||
      Number.isNaN(normalizedPrice) ||
      Number.isNaN(normalizedStock)
    ) {
      return
    }

    if (editing) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editing.id
            ? {
                ...product,
                code: code.trim(),
                name: name.trim(),
                price: normalizedPrice,
                stock: normalizedStock,
              }
            : product
        )
      )
    } else {
      setProducts((current) => [
        ...current,
        {
          id: `${Date.now()}`,
          code: code.trim(),
          name: name.trim(),
          price: normalizedPrice,
          stock: normalizedStock,
        },
      ])
    }

    closeDialog()
  }

  const deleteProduct = (id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id))
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col gap-6 bg-muted/20 p-6">
      <ProdutosToolbar
        search={search}
        onSearchChange={setSearch}
        onNewProduct={openNewProduct}
      />
      <ProdutosTable
        products={filteredProducts}
        onEditProduct={openEditProduct}
        onDeleteProduct={deleteProduct}
      />
      <ProdutosDialog
        open={dialogOpen}
        editing={editing}
        code={code}
        name={name}
        price={price}
        stock={stock}
        onCodeChange={setCode}
        onNameChange={setName}
        onPriceChange={setPrice}
        onStockChange={setStock}
        onClose={closeDialog}
        onSave={saveProduct}
      />
    </div>
  )
}
