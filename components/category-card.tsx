"use client"

import Image from "next/image"
import Link from "next/link"
import { getProductImage } from "@/lib/product-images"

interface CategoryCardProps {
  category: string
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const displayCategory = category === "Accessory" ? "Accessories" : category
  const displayCategoryPlural = category === "Accessory" ? "Accessories" : `${category}s`

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-100 flex items-center justify-center relative">
        <Image
          src={getProductImage("", displayCategory) || "/placeholder.svg"}
          alt={category}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{category}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{displayCategoryPlural}</h3>
        <p className="text-sm text-gray-600 mb-4">
          {category === "Laptop" && "Powerful computers for work and play"}
          {category === "Tablet" && "Portable devices for entertainment"}
          {category === "Mobile" && "Smartphones with great features"}
          {category === "Accessory" && "Essential add-ons for your devices"}
        </p>
        <Link href={`/shop?category=${category}`} className="text-blue-600 hover:text-blue-800 font-medium">
          View {displayCategoryPlural} →
        </Link>
      </div>
    </div>
  )
}

