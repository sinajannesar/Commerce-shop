'use client'

import Image from 'next/image'
import { Product } from '@/types/types'
import { Suspense, useState } from 'react'
import { handleOrder } from '@/lib/handelerproducts/handeler'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/useCartStore'
import styles from './ProductCard.module.css'

// Define type for cart items
interface CartItem {
  name: string
  price: number
  quantity: number
}

// Order data type for handleOrder
interface OrderData {
  items: CartItem[]
  total: number
}

export default function ProductCard({ product }: { product: Product }) {
  const { quantity, setQuantity } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (isLoading) return // Prevent multiple clicks

    try {
      setIsLoading(true)

      // Increase total cart items count
      const newCartQuantity = quantity + 1 // فقط یک آیتم اضافه می‌شود
      setQuantity(newCartQuantity)

      // Calculate total price for this product (فقط یک آیتم)
      const totalItemPrice = product.price

      const loadingToast = toast.loading('Adding to cart...')

      const result = await handleOrder({
        items: [
          {
            name: product.title,
            price: product.price,
            quantity: 1, // تعداد ثابت 1
          },
        ],
        total: totalItemPrice,
      } as OrderData)

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      // Show success or error message
      if (result?.error) {
        console.error('Error in handler:', result.error)
        toast.error('Failed to add to cart')
      } else {
        toast.success(`Added ${product.title} to cart`)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* Image */}
      <div className={styles.imageWrapper}>
        {product.image ? (
          <Suspense fallback={<div className={styles.imageFallback} />}>
            <Image
              src={product.image}
              alt={String(product.title)}
              fill
              sizes="(max-width: 968px) 100vw, (max-width: 1400px) 50vw, 33vw"
              className={styles.image}
            />
          </Suspense>
        ) : (
          <div className={styles.imageFallback} />
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.title}>{product.title}</h1>
        <p className={styles.description}>{product.description}</p>
        <p className={styles.price}>
          Price: <span className={styles.priceValue}>${product.price.toLocaleString()}</span>
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={handleClick}
          disabled={isLoading}
          className={`${styles.addButton} ${isLoading ? styles.disabled : ''}`}
        >
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}