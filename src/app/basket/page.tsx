'use client'

import { FaTrash } from 'react-icons/fa'
import { useCartStore } from '@/lib/store/useCartStore'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, removeItem, clearCart, updateQuantity } = useCartStore()
  const { data: session } = useSession()
  const router = useRouter()

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleCheckout = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    if (items.length === 0) return

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })

      if (!response.ok) throw new Error('Network error')

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error(error)
      alert('Error during checkout')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0C1222] via-[#0F1628] to-[#131B30] py-10 px-4 flex justify-center mt-15 ">
      <div className="bg-gradient-to-r from-gray-900/90 to-black/90  rounded-2xl shadow-lg p-6 w-full max-w-2xl ">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6 text-white bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
          Shopping Cart
        </h1>

        {/* Items */}
        <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {items.length > 0 ? (
            items.map((item, index) => (
              <li key={index} className="flex justify-between items-center text-gray-300 text-sm p-2 rounded-lg hover:bg-gray-800/50 transition-all">
                <div className="flex items-center">
                  <span className="font-medium">{item.name}</span>
                  <span className="ml-2 text-gray-400">x{item.quantity}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-1 text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => updateQuantity(item.name)} className="p-1 mr-2 text-purple-400 hover:text-purple-300">
                    +
                  </button>
                  <button onClick={() => removeItem(item.name)} className="p-1 text-red-400 hover:text-red-300">
                    <FaTrash size={14} />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="text-center text-gray-400 py-4">Your cart is empty</li>
          )}
        </ul>

        {/* Total */}
        <div className="flex justify-between items-center mt-6 text-lg font-semibold text-white border-t border-gray-700 pt-4">
          <span>Total:</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            ${totalPrice.toFixed(2)}
          </span>
        </div>

        <p className="text-sm text-gray-400 mt-2 text-center">
          {session ? "You're signed in and ready to checkout" : "Please sign in to complete your purchase"}
        </p>

        {/* Buttons */}
        <div className="mt-4 flex space-x-3">
          <button 
            onClick={clearCart} 
            disabled={items.length === 0} 
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-xl"
          >
            Clear Cart
          </button>
          <button 
            onClick={handleCheckout} 
            disabled={items.length === 0} 
            className={`flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 rounded-xl shadow-md ${items.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {session ? "Proceed to Verify" : "Sign In & Checkout"}
          </button>
        </div>
      </div>
    </main>
  )
}