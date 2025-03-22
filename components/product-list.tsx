import type { Product } from "@/lib/types"
import ProductCard from "./product-card"

interface ProductListProps {
  products: Product[]
  addToCart: (product: Product, quantity: number) => void
}

export default function ProductList({ products, addToCart }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">No products found</h2>
        <p className="text-gray-500 mt-2">Try changing your filter criteria</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products ({products.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </div>
  )
}

