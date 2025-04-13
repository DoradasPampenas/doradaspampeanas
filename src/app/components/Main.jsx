'use client'

import PedidosSection from "./PedidosSection"
import MenuSection from "./MenuSection"
import { useEffect, useState } from "react"
import { db } from "../firebase"
import { doc, getDoc } from "firebase/firestore"
import { UserAuth } from "../context/AuthContext"

export default function Main() {
  const { uid } = UserAuth() // Asegurate de tener el UID del cliente logueado
  const [cliente, setCliente] = useState(null)

  useEffect(() => {
    if (uid) {
      const ref = doc(db, 'clientes', uid)
      getDoc(ref).then(docSnap => {
        if (docSnap.exists()) {
          setCliente(docSnap.data())
        }
      })
    }
  }, [uid])

  const doradas = cliente?.DORADAS || 0
  const restantes = 7 - doradas

  return (
    <main className="flex-1 px-6 max-w-6xl mx-auto">
      
      {cliente && (
        <section className="my-8 bg-yellow-50 border-2 border-yellow-300 rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-yellow-600 mb-2">¡Tu camino a la Empanada de Oro!</h2>
          <p className="text-gray-700 mb-4">
            Llevás <span className="font-bold text-yellow-700">{doradas}</span> compras.
            {doradas >= 7
              ? " Ya podés reclamar tu empanada dorada en tu próximo pedido 🎉"
              : ` Te faltan ${restantes} compras para una empanada de oro.`}
          </p>

          <div className="flex justify-center items-center gap-2 mt-2">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full border-2 ${
                  i < doradas ? 'bg-yellow-400 border-yellow-500' : 'bg-white'
                }`}
              ></div>
            ))}
          </div>
        </section>
      )}

      {/* Sección Pedidos */}
      <section id="pedidos">
        <PedidosSection />
      </section>

      {/* Menú */}
      <MenuSection />


    </main>
  )
}
