'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useCartStore } from '@/lib/store/useCartStore'
import { NavbarLinks } from './NavbarLinks'
import { NavbarButtons } from './NavbarButtons'
import { MobileMenu } from './MobileMenu'
import { CartModal } from './CartModal'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [opacity, setOpacity] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: session } = useSession()
  const { items } = useCartStore()

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
        role="navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center" role="banner">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center animate-pulse shadow-lg">
                <span className="text-2xl font-extrabold text-white tracking-tight">S</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-white tracking-wide bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                SHOP
              </span>
            </div>

            {/* Links */}
            <NavbarLinks />

            {/* Desktop Buttons */}
            <NavbarButtons itemsCount={items.length} session={session} onCartClick={() => setIsModalOpen(true)} />

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                aria-label="Toggle Menu"
                aria-expanded={menuOpen ? 'true' : 'false'}
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-xl bg-gray-800/50 text-gray-100 hover:text-white focus:outline-none transition-all duration-300"
              >
                {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && <MobileMenu session={session} />}
      </nav>

      {/* Cart Modal */}
      {isModalOpen && <CartModal onClose={() => setIsModalOpen(false)} />}
    </>
  )
}
