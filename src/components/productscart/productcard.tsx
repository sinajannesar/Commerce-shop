'use client'

import Image from 'next/image'
import { Product } from '@/types/types'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useCartStore } from '../../lib/store/useCartStore'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      addItem({
        id: product.id?.toString(),
        name: product.title,
        price: product.price,
        quantity: 1,
      })

      toast.success(`Added ${product.title} to cart`)
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        {product.image ? (
          <div className="relative w-full aspect-[3/4]">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain"
              quality={70}
              placeholder="empty"
              blurDataURL="data:image/svg+xml;base64,..."
            />
          </div>
        ) : (
          <div className={styles.imageFallback} />
        )}
      </div>


      <div className={styles.content}>
        <h1 className={styles.title}>{product.title}</h1>
        <p className={styles.description}>{product.description}</p>
        <p className={styles.price}>
          Price: <span className={styles.priceValue}>${product.price.toLocaleString()}</span>
        </p>

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
