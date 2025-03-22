"use client"

import { useState } from "react"
import Image from "next/image"
import type { CartItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, ShoppingCart, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { getProductImage } from "@/lib/product-images"

interface FloatingCartProps {
  cartItems: CartItem[]
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

export default function FloatingCart({ cartItems, updateQuantity, removeItem, clearCart }: FloatingCartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  }

  const calculateSavings = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.msrp - item.product.price) * item.quantity
    }, 0)
  }

  const handleCheckout = () => {
    setIsCheckingOut(true)
    // Simulate checkout process
    setTimeout(() => {
      alert("Thank you for your purchase!")
      clearCart()
      setIsCheckingOut(false)
      setIsOpen(false)
    }, 1500)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg flex flex-col items-center justify-center"
          size="lg"
        >
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs">{itemCount}</Badge>}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Shopping Cart ({itemCount} items)
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 flex-1 flex flex-col items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 p-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="mb-4">
                    <div className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image
                          src={
                            getProductImage(
                              item.product.id,
                              item.product.group === "Accessory" ? "Accessories" : item.product.group,
                            ) || "/placeholder.svg"
                          }
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.product.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">
                          {item.product.group === "Accessory" ? "Accessories" : item.product.group}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="h-7 w-7 rounded-r-none"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <div className="px-3 py-1 border-y border-x-0 border-input h-7 flex items-center justify-center w-8">
                          {item.quantity}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="h-7 w-7 rounded-l-none"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">${item.product.price.toFixed(2)} each</p>
                      </div>
                    </div>
                    <Separator className="my-3" />
                  </div>
                ))}
              </ScrollArea>

              <div className="border-t p-4 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  {calculateSavings() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>You save:</span>
                      <span>${calculateSavings().toFixed(2)}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full mt-4" disabled={isCheckingOut} onClick={handleCheckout}>
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Checkout"
                  )}
                </Button>

                <Button variant="outline" className="w-full mt-2" onClick={() => setIsOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

