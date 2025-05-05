
import { FaTimes, FaTrash } from 'react-icons/fa'
import { useCartStore } from '@/lib/store/useCartStore'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface CartModalProps {
  onClose: () => void
}

export function CartModal({ onClose }: CartModalProps) {
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

    onClose()
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex justify-center items-center transition-opacity duration-500">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 relative animate-modal-open">
        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full focus:outline-none transition-transform duration-300 hover:rotate-90">
          <FaTimes size={18} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900 bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
          Shopping Cart
        </h2>

        {/* Items */}
        <ul className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {items.length > 0 ? (
            items.map((item, index) => (
              <li key={index} className="flex justify-between items-center text-gray-700 text-sm p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200">
                <div className="flex items-center">
                  <span className="font-medium">{item.name}</span>
                  <span className="ml-2 text-gray-500">x{item.quantity}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-1">${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => updateQuantity(item.name)} className="p-1 mr-2 text-purple-600 hover:text-purple-800">
                    +
                  </button>
                  <button onClick={() => removeItem(item.name)} className="p-1 text-red-500 hover:text-red-700">
                    <FaTrash size={14} />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500 py-4">Your cart is empty</li>
          )}
        </ul>

        {/* Total */}
        <div className="flex justify-between items-center mt-6 text-lg font-semibold text-gray-900 border-t border-gray-200 pt-4">
          <span>Total:</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            ${totalPrice.toFixed(2)}
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-2 text-center">
          {session ? "You're signed in and ready to checkout" : "Please sign in to complete your purchase"}
        </p>

        {/* Buttons */}
        <div className="mt-4 flex space-x-3">
          <button onClick={clearCart} disabled={items.length === 0} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-xl transition-all duration-300">
            Clear Cart
          </button>
          <button onClick={handleCheckout} disabled={items.length === 0} className={`flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ${items.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {session ? "Proceed to Verify" : "Sign In & Checkout"}
          </button>
        </div>
      </div>
    </div>
  )
}
