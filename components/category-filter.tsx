"use client"

import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onCategoryChange: (category: string) => void
}

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === (category === "All" ? null : category) ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className="min-w-[100px]"
        >
          {category}
        </Button>
      ))}
    </div>
  )
}

