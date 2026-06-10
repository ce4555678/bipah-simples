export interface Product {
  id: string
  code: string
  name: string
  price: number
  stock: number
}

export interface CartItem extends Product {
  qty: number
  discount: number
}
