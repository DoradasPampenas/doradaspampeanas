'use client'

import { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'

export default function VentasCRUD() {
  const [ventas, setVentas] = useState([])

  const obtenerVentas = async () => {
    const snapshot = await getDocs(collection(db, 'ventas'))
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setVentas(data)
  }
 
  const actualizarEstado = async (id, estado) => {
    await updateDoc(doc(db, 'ventas', id), { estado })
    obtenerVentas()
  }

  useEffect(() => {
    obtenerVentas()
  }, [])

  const total = ventas.reduce((acc, v) => acc + parseFloat(v.total || 0), 0)

  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-orange-600 mb-4">Gestión de Ventas</h2>
      <p className="mb-2 font-medium">Total recaudado: ${total.toFixed(2)}</p>
      {ventas.map(v => (
        <div key={v.id} className="bg-orange-50 p-3 rounded mb-2">
          <div className="flex justify-between items-center">
            <div>
              <p><strong>Cliente:</strong> {v.cliente?.nombre || 'Anónimo'}</p>
              <p><strong>Total:</strong> ${v.total}</p>
              <p className="text-sm text-gray-600"><strong>Estado:</strong> {v.estado}</p>
            </div>
            <select
              value={v.estado}
              onChange={(e) => actualizarEstado(v.id, e.target.value)}
              className="px-2 py-1 rounded border"
            >
              <option value="pendiente">Pendiente</option>
              <option value="pagadoMP">Pagado MP</option>
              <option value="imprimiendo">Imprimiendo</option>
              <option value="finalizada">Finalizada</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  )
}
