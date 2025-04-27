'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaShoppingCart, FaTimes, FaBars, FaTrash } from 'react-icons/fa'
import { useCartStore } from '@/lib/store/useCartStore' // Import the store

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [opacity, setOpacity] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Use the cart store
  const { items, removeItem, clearCart, updateQuantity } = useCartStore()
  
  // Calculate total price from cart items
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const newOpacity = Math.max(1 - scrollY / 300, 0.4)
      setOpacity(newOpacity)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        style={{ opacity }}
        className="fixed top-0 z-50 w-full bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-xl shadow-lg transition-all duration-500"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center animate-pulse shadow-lg">
                <span className="text-2xl font-extrabold text-white tracking-tight">S</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-white tracking-wide bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                SHOP
              </span>
            </div>

            {/* Links */}
            <div className="hidden md:flex ml-10 items-center space-x-6">
              {['Home', 'Features', 'Pricing', 'Resources', 'Contact'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="relative px-4 py-2 text-sm font-medium text-gray-100 hover:text-white transition-all duration-300 group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>

            {/* Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                className="relative p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/70 text-gray-100 hover:text-white transition-all duration-300 group"
                onClick={() => setIsModalOpen(true)}
              >
                <FaShoppingCart size={18} />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full px-2 py-0.5 animate-bounce">
                    {items.length}
                  </span>
                )}
              </button>

              <Link
                href="/login"
                className="bg-transparent hover:bg-gray-800/50 text-gray-100 font-medium py-2 px-5 border border-gray-600 hover:border-purple-500 rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-xl bg-gray-800/50 text-gray-100 hover:text-white focus:outline-none transition-all duration-300"
              >
                {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-lg border-t border-gray-800/50 animate-slide-in">
            <div className="space-y-2 px-4 py-6">
              {['Home', 'Features', 'Pricing', 'Resources', 'Contact'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block py-3 px-4 text-gray-100 font-medium hover:bg-purple-900/30 hover:text-white rounded-xl transition-all duration-300"
                >
                  {item}
                </a>
              ))}
              <div className="flex flex-col space-y-3 pt-4">
                <Link
                  href="/login"
                  className="bg-transparent hover:bg-gray-800/50 text-gray-100 font-medium py-3 px-4 border border-gray-600 hover:border-purple-500 rounded-xl transition-all duration-300 text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex justify-center items-center transition-opacity duration-500">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 relative animate-modal-open">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full focus:outline-none transition-transform duration-300 hover:rotate-90"
              onClick={() => setIsModalOpen(false)}
            >
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
                  <li
                    key={index}
                    className="flex justify-between items-center text-gray-700 text-sm p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{item.name}</span>
                      <span className="ml-2 text-gray-500">x{item.quantity}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold mr-3">${(item.price * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => updateQuantity(item.name)}
                        className="p-1 mr-2 text-purple-600 hover:text-purple-800"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeItem(item.name)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
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

            {/* Buttons */}
            <div className="mt-6 flex space-x-3">
              <button 
                onClick={() => clearCart()}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-xl transition-all duration-300"
              >
                Clear Cart
              </button>
              <button className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tailwind CSS Custom Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
          font-family: 'Inter', sans-serif;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        @keyframes slideIn {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes modalOpen {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.4s ease-out;
        }

        .animate-modal-open {
          animation: modalOpen 0.4s ease-out;
        }
      `}</style>
    </>
  )
}