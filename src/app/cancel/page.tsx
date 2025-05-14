
import Link from 'next/link'
import Buttoncancel from './buttoncancel'
import React from 'react'
export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C1222] to-[#131B30] text-gray-200 pt-24 flex items-center justify-center">
      <div className="bg-[#1A223C]/80 backdrop-blur-sm rounded-2xl border border-[#2A3454] shadow-xl max-w-md w-full p-8 text-center animate-fadeIn">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12" role='img' aria-hidden="true" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-white">Payment Cancelled</h1>
        <p className="text-gray-400 mb-6">Your payment process was cancelled.</p>
        
        <div className="flex flex-col sm:flex-row sm:space-x-3 justify-center">
          <Link 
            href="/"
            className="bg-transparent hover:bg-[#2A3454]/50 text-gray-300 py-3 px-6 border border-[#2A3454] rounded-xl mb-3 sm:mb-0"
          >
            Back to Home
          </Link>
         <Buttoncancel/>
        </div>
      </div>
    </div>
  )
}