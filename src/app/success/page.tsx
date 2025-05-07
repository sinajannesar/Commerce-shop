"use client"

import { useCartStore } from '@/lib/store/useCartStore'
import Link from 'next/link'


export default function SuccessPage() {
  const { clearCart } = useCartStore()
  clearCart()



  return (
    <div className="min-h-screen bg-[#0C1222] text-gray-200 pt-24 flex items-center justify-center">
      <div 
        className="bg-[#1A223C] rounded-xl border border-[#2A3454] shadow-lg max-w-md w-full p-6 text-center"
        style={{animation: 'fadeIn 0.4s ease-out'}}
      >
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        
        <h1 className="text-xl font-bold mb-2 text-white">Payment Successful!</h1>
        <p className="text-gray-400 mb-5">
          Thank you for your purchase.
        </p>

        <Link 
        href='/'
        onClick={() => clearCart()}
           className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
      
     
      
    </div>
  )
}
