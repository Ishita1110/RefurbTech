import Link from "next/link"
import type { Product } from "@/lib/types"
import CategoryCard from "@/components/category-card"
import FeaturedProductCard from "@/components/featured-product-card"

async function getProducts() {
  try {
    const res = await fetch("https://s3.us-east-1.amazonaws.com/assets.spotandtango/products.json")
    if (!res.ok) {
      throw new Error("Failed to fetch products")
    }
    return res.json()
  } catch (error) {
    console.error("Error loading products:", error)
    return []
  }
}

export default async function Home() {
  const products = await getProducts()

  // Get one product from each category for the landing page
  const categories = ["Laptop", "Tablet", "Mobile", "Accessory"]
  const featuredProducts: Record<string, Product> = {}

  categories.forEach((category) => {
    const productsInCategory = products.filter((p: Product) => p.group === category && p.status === "Available")
    if (productsInCategory.length > 0) {
      // Just grab the first available one
      featuredProducts[category] = productsInCategory[0]
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">RefurbTech</h1>
          <nav>
            <Link
              href="/shop"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Shop All Products
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg mb-10 shadow-sm">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Quality Refurbished Electronics</h2>
            <p className="text-gray-700 mb-6 text-lg">
              Shop our selection of premium refurbished laptops, tablets, phones, and accessories at affordable prices.
            </p>
            <Link
              href="/shop"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md inline-block transition-colors font-medium"
            >
              Browse Products
            </Link>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category} category={category} />
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(featuredProducts).map((product: Product) => (
              <FeaturedProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-16 pt-8 border-t text-center text-gray-500">
        <p>RefurbTech</p>
      </footer>
    </div>
  )
}

