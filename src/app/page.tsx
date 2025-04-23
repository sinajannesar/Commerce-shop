import { fetchProducts } from "@/services/useproducts";
import { Product } from "@/types/types";
import ProductCard from "@/components/productscart/productcard";

export default async function ProductsPage() {
  const products: Product[] = await fetchProducts();

  return (
    <div className="min-h-screen bg-black px-6 py-10">
      <h1 className="text-white text-3xl font-bold text-center mb-10">
        Our products
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
