"use client"

const categoryImages: Record<string, string> = {
  Laptop: "/Laptop.jpg?height=300&width=400&text=Laptop",
  Tablet: "/Tablet.jpeg?height=300&width=400&text=Tablet",
  Mobile: "/iphone.jpeg?height=300&width=400&text=Mobile",
  Accessories: "/headphones.jpeg?height=300&width=400&text=Accessories",
}


const productImages: Record<string, string> = {
 
}


export function getProductImage(productId: string, group: string): string {
  // First check if there's a specific image for this product ID
  if (productId && productImages[productId]) {
    return productImages[productId]
  }

  const categoryKey = group === "Accessory" ? "Accessories" : group
  return categoryImages[categoryKey] || "/placeholder.svg?height=300&width=400&text=Product"
}


const productSpecificImages: Record<string, string> = {
}

// Colors for product images to make them visually distinct
const colors = [
  "FF5733",
  "33FF57",
  "3357FF",
  "F3FF33",
  "FF33F3",
  "33FFF3",
  "FF8C33",
  "8C33FF",
  "33FF8C",
  "FF338C",
  "8CFF33",
  "338CFF",
  "FFCC33",
  "33FFCC",
  "CC33FF",
  "FFCC99",
  "99FFCC",
  "CC99FF",
  "FF99CC",
  "99FF99",
]


export function setProductImage(productId: string, imageUrl: string): void {
  if (productId && imageUrl) {
    productSpecificImages[productId] = imageUrl
  }
}


function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

