import Link from 'next/link'
import { FaShoppingCart } from 'react-icons/fa'
import { Session } from "next-auth"


interface NavbarButtonsProps {
  itemsCount: number
  session: Session 
  onCartClick: () => void
}

export function NavbarButtons({ itemsCount, session, onCartClick }: NavbarButtonsProps) {
  return (
    <div className="hidden md:flex items-center space-x-4">
      <button
        className="relative p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/70 text-gray-100 hover:text-white transition-all duration-300 group"
        onClick={onCartClick}
      >
        <FaShoppingCart size={18} />
        {itemsCount > 0 && (
          <span className="absolute -top-1 -right-1 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full px-2 py-0.5 animate-bounce">
            {itemsCount}
          </span>
        )}
      </button>

      {!session ? (
        <>
          <Link href="/login" className="bg-transparent hover:bg-gray-800/50 text-gray-100 font-medium py-2 px-5 border border-gray-600 hover:border-purple-500 rounded-xl transition-all duration-300 hover:shadow-lg">
            Sign In
          </Link>
          <Link href="/register" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
            Get Started
          </Link>
        </>
      ) : (
        <div className="flex items-center space-x-3">
          <span className="text-gray-300 text-sm">Hi, {session.user?.name || 'User'}</span>
          <Link href="/api/auth/signout" className="bg-transparent hover:bg-gray-800/50 text-gray-100 font-medium py-2 px-4 border border-gray-600 hover:border-red-500 rounded-xl transition-all duration-300 hover:shadow-lg">
            Sign Out
          </Link>
        </div>
      )}
    </div>
  )
}
