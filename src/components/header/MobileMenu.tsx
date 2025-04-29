import Link from 'next/link'
import { Session } from "next-auth"

interface MobileMenuProps {
  session: Session 
}

export function MobileMenu({ session }: MobileMenuProps) {
  const links = ['Home', 'Features', 'Pricing', 'Resources', 'Contact']

  return (
    <div className="md:hidden bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-lg border-t border-gray-800/50 animate-slide-in">
      <div className="space-y-2 px-4 py-6">
        {links.map((item) => (
          <a
            key={item}
            href="#"
            className="block py-3 px-4 text-gray-100 font-medium hover:bg-purple-900/30 hover:text-white rounded-xl transition-all duration-300"
          >
            {item}
          </a>
        ))}
        <div className="flex flex-col space-y-3 pt-4">
          {!session ? (
            <>
              <Link href="/login" className="bg-transparent hover:bg-gray-800/50 text-gray-100 font-medium py-3 px-4 border border-gray-600 hover:border-purple-500 rounded-xl transition-all duration-300 text-center">
                Sign In
              </Link>
              <Link href="/register" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
                Get Started
              </Link>
            </>
          ) : (
            <Link href="/api/auth/signout/" className="bg-transparent hover:bg-gray-800/50 text-gray-100 font-medium py-3 px-4 border border-gray-600 hover:border-red-500 rounded-xl transition-all duration-300 text-center">
              Sign Out
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
