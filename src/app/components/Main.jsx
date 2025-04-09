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
      
      {/* Progreso de empanadas doradas */}
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

      {/* Ubicación */}
      <section id="ubicacion" className="px-4 py-12 bg-orange-50 rounded-2xl">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-orange-600 mb-4">¿Dónde estamos?</h2>
            <p className="text-gray-700 text-lg mb-6">
              Nos encontramos en Santa Rosa, La Pampa. Retirá tus empanadas o pedí delivery en minutos. Sabor casero, atención cálida.
            </p>
            <p className="text-gray-600 text-sm">
              🕒 Horario de atención: Lunes a Sábados de 19:00 a 23:30 hs.
            </p>
          </div>

          <div className="w-full lg:w-1/2 h-64 sm:h-96">
            <iframe
              title="Mapa ubicación Doraditas"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52548.24252508766!2d-64.317144!3d-36.616672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95c2cd295dc7fddf%3A0xb2a78e4c75fd46a4!2sSanta%20Rosa%2C%20La%20Pampa!5e0!3m2!1ses-419!2sar!4v1681342208893!5m2!1ses-419!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl shadow-md"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  )
}
