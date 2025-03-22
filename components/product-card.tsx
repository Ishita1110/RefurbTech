"use client"

import { useState } from "react"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Minus } from "lucide-react"
import { getProductImage } from "@/lib/product-images"

interface ProductCardProps {
  product: Product
  addToCart: (product: Product, quantity: number) => void
}

export default function ProductCard({ product, addToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const isAvailable = product.status === "Available"
  // Update group name if it's "Accessory"
  const group = product.group === "Accessory" ? "Accessories" : product.group
  const productImage = getProductImage(product.id, group)

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setQuantity(1) // Reset quantity after adding to cart
  }

  return (
    <Card className={`overflow-hidden ${!isAvailable ? "opacity-70" : ""}`}>
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={productImage || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
          priority={false}
        />
        <div className="absolute top-2 right-2">
          <Badge
            variant={
              product.group === "Laptop"
                ? "default"
                : product.group === "Tablet"
                  ? "secondary"
                  : product.group === "Mobile"
                    ? "destructive"
                    : "outline"
            }
          >
            {group}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 line-through">${product.msrp.toFixed(2)}</span>
            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        {isAvailable ? (
          <>
            <div className="flex items-center w-full">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="rounded-r-none"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                className="w-16 text-center rounded-none"
              />
              <Button variant="outline" size="icon" onClick={incrementQuantity} className="rounded-l-none">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button className="w-full" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </>
        ) : (
          <Button variant="destructive" className="w-full" disabled>
            Sold Out
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

