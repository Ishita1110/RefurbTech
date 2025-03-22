"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { Product, CartItem } from "@/lib/types"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getProductImage } from "@/lib/product-images"

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCart, setShowCart] = useState(false)
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://s3.us-east-1.amazonaws.com/assets.spotandtango/products.json")
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()

        // Log product IDs to help with image mapping
        console.log(
          "Product IDs:",
          data.map((p: Product) => p.id),
        )

        setProducts(data)
        setFilteredProducts(data)
      } catch (err) {
        setError("Error loading products. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = [...products]

    // First filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.group === selectedCategory)
    }

    // Then sort to move unavailable products to the end
    filtered.sort((a, b) => {
      if (a.status === "Unavailable" && b.status === "Available") return 1
      if (a.status === "Available" && b.status === "Unavailable") return -1
      return 0
    })

    setFilteredProducts(filtered)
  }, [selectedCategory, products])

  useEffect(() => {
    // Check URL for category parameter
    const urlParams = new URLSearchParams(window.location.search)
    const categoryParam = urlParams.get("category")
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [])

  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id)

      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        return [...prevCart, { product, quantity }]
      }
    })
  }

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item.product.id !== productId)
      }

      return prevCart.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const calculateSavings = () => {
    return cart.reduce((total, item) => total + (item.product.msrp - item.product.price) * item.quantity, 0)
  }

  const itemCount = cart.reduce((count, item) => count + item.quantity, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Loading products...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  // Get unique categories and rename "Accessory" to "Accessories" for display
  const categoriesSet = new Set(products.map((product) => product.group))
  const categories = ["All", ...Array.from(categoriesSet)].map((cat) =>
    cat === "Accessory" ? { id: "Accessory", display: "Accessories" } : { id: cat, display: cat },
  )

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-2xl font-bold">
            RefurbTech
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-4">Shop Our Products</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id === "All" ? null : category.id)}
              className={`px-4 py-2 rounded-md border transition-colors ${
                (category.id === "All" && selectedCategory === null) || category.id === selectedCategory
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-gray-300 hover:bg-gray-100"
              }`}
            >
              {category.display}
            </button>
          ))}
        </div>
      </header>

      {/* Floating Cart Button */}
      <button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center z-40 transition-colors"
        onClick={() => setShowCart(true)}
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs bg-red-500 border-0">{itemCount}</Badge>
        )}
      </button>

      {/* Shopping Cart Overlay */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Your Cart ({itemCount} items)</h2>
              <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700 text-xl">
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-gray-500 text-center py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p>Your cart is empty</p>
                <button
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => setShowCart(false)}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="divide-y">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-gray-500">
                            {item.product.group === "Accessory" ? "Accessories" : item.product.group}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                            className="px-3 py-1 border-r hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-4 py-1">{item.quantity}</span>
                          <button
                            onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                            className="px-3 py-1 border-l hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                          <p className="text-xs text-gray-500">${item.product.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-6 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>

                  {calculateSavings() > 0 && (
                    <div className="flex justify-between mb-2 text-green-600">
                      <span>You save:</span>
                      <span>${calculateSavings().toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-lg mb-6 pt-2 border-t">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>

                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
                    onClick={() => {
                      alert("Thank you for your purchase!")
                      setCart([])
                      setShowCart(false)
                    }}
                  >
                    Checkout
                  </button>

                  <button
                    className="w-full mt-3 border border-gray-300 hover:bg-gray-50 py-2 rounded-md transition-colors"
                    onClick={() => setShowCart(false)}
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${product.status === "Unavailable" ? "opacity-70" : ""}`}
          >
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <img
                src={
                  getProductImage(product.id, product.group === "Accessory" ? "Accessories" : product.group) ||
                  "/placeholder.svg"
                }
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1 truncate">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-3">
                {product.group === "Accessory" ? "Accessories" : product.group}
              </p>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-sm text-gray-500 line-through">${product.msrp.toFixed(2)}</span>
                  <span className="text-lg font-bold block text-blue-700">${product.price.toFixed(2)}</span>
                </div>
              </div>

              {product.status === "Available" ? (
                <div className="space-y-2">
                  <div className="flex items-center w-full">
                    <button
                      onClick={() => {
                        const currentQuantity = productQuantities[product.id] || 1
                        if (currentQuantity > 1) {
                          setProductQuantities({
                            ...productQuantities,
                            [product.id]: currentQuantity - 1,
                          })
                        }
                      }}
                      className="px-3 py-1 border rounded-l-md hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={productQuantities[product.id] || 1}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value) || 1
                        setProductQuantities({
                          ...productQuantities,
                          [product.id]: value,
                        })
                      }}
                      className="w-12 text-center border-y border-x-0 py-1"
                    />
                    <button
                      onClick={() => {
                        const currentQuantity = productQuantities[product.id] || 1
                        setProductQuantities({
                          ...productQuantities,
                          [product.id]: currentQuantity + 1,
                        })
                      }}
                      className="px-3 py-1 border rounded-r-md hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(product, productQuantities[product.id] || 1)
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              ) : (
                <button className="w-full bg-red-500 text-white py-2 px-4 rounded-md cursor-not-allowed" disabled>
                  Sold Out
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

