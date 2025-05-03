'use client'

import Image from 'next/image'
import { Product } from '@/types/types'
import {  useState } from 'react'
import toast from 'react-hot-toast'
import { useCartStore } from '../../lib/store/useCartStore'
import styles from './ProductCard.module.css'

export default function ProductCard({ product, isFirst = false }: { product: Product, isFirst?: boolean }) {
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
    } catch  {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
      {product.image ? (
    <Image
      src={product.image}
      alt={String(product.title)}
      fill
      priority={isFirst}
      sizes="(max-width: 968px) 100vw, (max-width: 1400px) 50vw, 33vw"
      className={styles.image}
    />
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
