'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaShoppingCart } from "react-icons/fa"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const newOpacity = Math.max(1 - scrollY / 300, 0.3) 
      setOpacity(newOpacity)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      style={{ opacity }}
      className="sticky top-0 z-50 w-full bg-black bg-opacity-90 backdrop-blur-lg transition-opacity duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center animate-glow">
              <span className="text-xl font-bold text-white">S</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-white">SHOP</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex ml-10 items-baseline space-x-8">
            {['Home', 'Features', 'Pricing', 'Resources', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                className="relative group px-3 py-2 text-lg font-medium text-white hover:text-white transition-all duration-300"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-all duration-300 relative">
              <FaShoppingCart />
            </button>

            <Link href="/login" className="bg-transparent hover:bg-gray-800 text-white font-medium py-2 px-4 border border-gray-700 hover:border-purple-500 rounded-lg transition-all duration-300">
              Sign In
            </Link>
            <Link href="/register" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 bg-gray-800 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden p-4 bg-black bg-opacity-95 border-t border-gray-800">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {['Home', 'Features', 'Pricing', 'Resources', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                className="block py-2 px-4 text-white font-medium hover:bg-purple-900 hover:bg-opacity-50 hover:text-white rounded-md transition-all duration-300"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
