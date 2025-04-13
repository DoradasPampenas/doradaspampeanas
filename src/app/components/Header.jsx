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

  // Obtener la cantidad de empanadas doradas del cliente logueado
  useEffect(() => {
    if (user?.uid) {
      const ref = doc(db, 'clientes', user.uid)
      getDoc(ref).then((docSnap) => {
        if (docSnap.exists()) {
          const cantidad = docSnap.data().empanadasDoradas || 0
          setDoradas(Math.max(0, Math.min(7, cantidad))) // Asegura que esté entre 0 y 7
        }
      })
    }
  }, [user?.uid])

  return (
    <header className="bg-orange-50 text-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo + Progreso de Empanadas */}
        <div className="flex items-center gap-4">
          <Image src="/LOGOREAL.png" alt="Logo" width={150} height={100} />

          {user && (
            <div className="flex items-center gap-1">
              {[...Array(7)].map((_, i) => (
                <span
                  key={i}
                  className={`text-2xl ${
                    i < doradas ? 'opacity-100' : 'opacity-20'
                  }`}
                >
                  🥟
                </span>
                
              ))}
              <p className="text-xl font-bold text-orange-300">{doradas}/7</p>
            </div>
          )}
        </div>

        {/* Navegación / Login */}
        <nav className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-3">
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
