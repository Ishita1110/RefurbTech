"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { getProductImage } from "@/lib/product-images"

interface FeaturedProductCardProps {
  product: Product
}

export default function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const displayGroup = product.group === "Accessory" ? "Accessories" : product.group

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-40 bg-gray-100 flex items-center justify-center relative">
        <Image
          src={getProductImage(product.id, displayGroup) || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">{displayGroup}</div>
      </div>
      <div className="p-4">
        <h3 className="font-bold mb-1 truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-3">{displayGroup}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500 line-through">${product.msrp.toFixed(2)}</span>
            <span className="text-lg font-bold block text-blue-700">${product.price.toFixed(2)}</span>
          </div>
          <Link href="/shop" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

