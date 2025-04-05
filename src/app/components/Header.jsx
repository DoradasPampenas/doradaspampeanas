'use client'

import Image from "next/image"
import { UserAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"

export default function Header() {
  const { user, googleSignIn, logOut } = UserAuth()
  const router = useRouter()

  const handleLogin = () => {
    googleSignIn()
  }

  const handleLogout = () => {
    logOut()
    router.push('/')
  }
  console.log(user)
  return (
    <header className="bg-orange-50 text-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Image src="/LOGOREAL.png" alt="Logo" width={150} height={100} />

        {/* Navegación */}
        <nav className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">Hola, {user.displayName.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="text-red-600 text-sm hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-1 rounded-md text-sm hover:bg-orange-600 transition"
            >
              Login con <Image src="/logo-google.png" alt="Google logo" width={18} height={18} />
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
