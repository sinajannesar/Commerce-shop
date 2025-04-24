"use client"
import Image from "next/image";
import { Product } from "@/types/types";
import { Suspense } from "react";
import { handleOrder } from "@/lib/handelerproducts/handeler";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/useCartStore";

export default function ProductCard({ product }: { product: Product }) {
  const { quantity, setQuantity } = useCartStore(); 
  const handleClick = async () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);

    const result = await handleOrder({
      items: [{ productId: product.id, quantity: newQuantity }],
      total: product.price * newQuantity,
    });

    if (result.error) {
      console.error("error in the handler:", result.error);
      toast.error("Failed to add order.");
    } else {
      toast.success(`Order placed with quantity: ${newQuantity}`);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-md hover:shadow-lg transition duration-300">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-white ">
        {product.image ? (
          <Suspense>
            <Image
              src={product.image}
              alt={String(product.title)}
              fill
              sizes="(max-width: 968px) 100vw, (max-width: 1400px) 50vw, 33vw"
              className="object-cover"
            />
          </Suspense>
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
      </div>

      <h1 className="text-white text-sm font-semibold mb-2 line-clamp-2 mt-3">{product.title}</h1>
      <p className="text-neutral-300 text-sm line-clamp-3 mb-2">{product.description}</p>
      <p className="text-neutral-400 mb-2 text-sm">
        Price: {product.price.toLocaleString()} $
      </p>

      <button onClick={handleClick}
        className="w-full border border-white text-white py-2 rounded-xl hover:bg-white hover:text-black transition">
        Add to Cart
      </button>
    </div>
  );
}
