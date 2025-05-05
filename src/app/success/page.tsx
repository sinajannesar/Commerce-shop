'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/useCartStore'
import { motion } from 'framer-motion'

export default function SuccessPage() {
  const { clearCart } = useCartStore()
  
  useEffect(() => {
    clearCart()
  }, [clearCart])
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C1222] to-[#131B30] text-gray-200 pt-24 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1A223C]/80 backdrop-blur-sm rounded-2xl border border-[#2A3454] shadow-xl max-w-md w-full p-8 text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-white">Payment Successful!</h1>
        <p className="text-gray-400 mb-6">
          Thank you for your purchase. Your order has been processed successfully.
        </p>
        
        <Link 
          href="/"
          className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-md transition-all duration-300"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  )
}