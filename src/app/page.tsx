import { fetchProducts } from '@/services/useproducts'
import { Product } from '@/types/types'
// import ProductCard from '@/components/productscart/productcard'
import styles from '../ProductsPage.module.css'
import dynamic from 'next/dynamic'
const ProductCard = dynamic(() => import('@/components/productscart/productcard'), { ssr: true }) 
export default async function ProductsPage() {
  const products: Product[] = await fetchProducts()

  return (
    <div className={styles.container}>

      <div className={styles.grid} style={{ animationDelay: '0.2s' }}>
        {products.map((product, index) => (
          <div
            key={product.id}
            className={styles.cardWrapper}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
