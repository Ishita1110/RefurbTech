export interface Product {
  id: string
  name: string
  group: string
  msrp: number
  price: number
  status: string
}

export interface CartItem {
  product: Product
  quantity: number
}

