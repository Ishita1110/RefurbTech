"use client"

// Map of product groups to category images (fallbacks)
const categoryImages: Record<string, string> = {
  Laptop: "/Laptop.jpg?height=300&width=400&text=Laptop",
  Tablet: "/Tablet.jpeg?height=300&width=400&text=Tablet",
  Mobile: "/iphone.jpeg?height=300&width=400&text=Mobile",
  Accessories: "/headphones.jpeg?height=300&width=400&text=Accessories",
}


const productImages: Record<string, string> = {
 
}

/**
 * Get image for a specific product
 * @param productId - The ID of the product
 * @param group - The category/group of the product
 * @returns The image URL for the product
 */
export function getProductImage(productId: string, group: string): string {
  // First check if there's a specific image for this product ID
  if (productId && productImages[productId]) {
    return productImages[productId]
  }

  // If no specific image, use the category image
  const categoryKey = group === "Accessory" ? "Accessories" : group
  return categoryImages[categoryKey] || "/placeholder.svg?height=300&width=400&text=Product"
}

// Map of individual product IDs to specific images
// Add your product IDs and image paths here
const productSpecificImages: Record<string, string> = {
  // Example: "product-id-1": "/images/specific-product-1.jpg",
  // Example: "product-id-2": "/images/specific-product-2.jpg",
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

/**
 * Add or update an image for a specific product
 * @param productId - The ID of the product
 * @param imageUrl - The URL of the image
 */
export function setProductImage(productId: string, imageUrl: string): void {
  if (productId && imageUrl) {
    productSpecificImages[productId] = imageUrl
  }
}

/**
 * Simple hash function to convert a string to a number
 * @param str - The string to hash
 * @returns A numeric hash code
 */
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

/**
 * USAGE EXAMPLE:
 *
 * To see the actual product IDs in your data, you can log them in the console:
 *
 * In app/shop/page.tsx, add this inside the useEffect where you fetch products:
 *
 * useEffect(() => {
 *   const fetchProducts = async () => {
 *     try {
 *       // ... existing code ...
 *       const data = await response.json()
 *
 *       // Log product IDs to see what they look like
 *       console.log("Product IDs:", data.map(p => p.id))
 *
 *       // ... rest of existing code ...
 *     }
 *   }
 * }, [])
 *
 * Then check your browser console to see the actual IDs.
 */

