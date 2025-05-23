'use client'

import Image from "next/image"
import { UserAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { db } from "../firebase"
import { doc, getDoc } from "firebase/firestore"

export default function Header() {
  const { user, googleSignIn, logOut } = UserAuth()
  const router = useRouter()
  const [doradas, setDoradas] = useState(0)

  const handleLogin = () => {
    googleSignIn()
  }

  const handleLogout = () => {
    logOut()
    router.push('/')
  }

  useEffect(() => {
    if (user?.uid) {
      const ref = doc(db, 'clientes', user.uid)
      getDoc(ref).then((docSnap) => {
        if (docSnap.exists()) {
          const cantidad = docSnap.data().empanadasDoradas || 0
          setDoradas(Math.max(0, Math.min(7, cantidad)))
        }
      })
    }
  }, [user?.uid])
  return (
    <header className="bg-orange-50 text-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0">
  
        {/* Logo + Progreso de Empanadas */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center justify-center">
            <Image
              src="/LOGOREAL.png"
              alt="Logo"
              width={130}
              height={80}
              className="object-contain"
            />
          </div>
  
          {user && (
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-1 mt-2 sm:mt-0">
              {[...Array(7)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xl sm:text-2xl ${
                    i < doradas ? 'opacity-100' : 'opacity-20'
                  }`}
                >
                  🥟
                </span>
              ))}
              <p className="ml-2 text-sm sm:text-lg font-bold text-orange-300">{doradas}/7</p>
            </div>
          )}
        </div>
  
        {/* Navegación / Login */}
        <nav className="flex items-center justify-center sm:justify-end w-full sm:w-auto">
          {user ? (
            <div className="flex items-center gap-3 text-center">
              <span className="text-sm text-gray-700">
                Hola, {user.displayName?.split(" ")[0]}
              </span>
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
