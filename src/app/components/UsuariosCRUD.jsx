'use client'

import { useEffect, useState } from 'react'
import { db } from '../firebase'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore'

export default function UsuariosCRUD() {
  const [usuarios, setUsuarios] = useState([])

  const obtenerUsuarios = async () => {
    const snapshot = await getDocs(collection(db, 'usuarios'))
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setUsuarios(data)
  }

  const eliminarUsuario = async (id) => {
    await deleteDoc(doc(db, 'usuarios', id))
    obtenerUsuarios()
  }

  const reclamarDorada = async (usuario) => {
    if (usuario.doradas > 0) {
      const ref = doc(db, 'usuarios', usuario.id)
      await updateDoc(ref, {
        doradas: usuario.doradas - 1
      })
      obtenerUsuarios()
      alert(`🎉 ${usuario.nombre} ha reclamado una empanada dorada!`)
    } else {
      alert('Este usuario no tiene empanadas doradas para reclamar.')
    }
  }

  useEffect(() => {
    obtenerUsuarios()
  }, [])

  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">Gestión de Clientes</h2>
      {usuarios.map(u => (
        <div key={u.id} className="flex justify-between items-center bg-orange-50 p-4 rounded mb-4">
          <div>
            <p className="font-semibold">{u.nombre} {u.apellido}</p>
            <p className="text-sm text-gray-700">📞 {u.telefono}</p>
            <p className="text-sm text-gray-700">📍 {u.direccion}</p>
            <p className="text-sm text-gray-500">📝 {u.observacion}</p>
            <p className="text-sm text-gray-500">UID: {u.uid}</p>
            <p className="text-sm mt-1 text-yellow-600">🥟 Doradas: {u.doradas} | 📦 Compras: {u.docenasGanadas}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => reclamarDorada(u)}
              disabled={u.doradas <= 0}
              className={`text-sm px-3 py-1 rounded-md ${
                u.doradas > 0
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Reclamar Dorada
            </button>
            <button
              onClick={() => eliminarUsuario(u.id)}
              className="text-red-600 hover:underline text-sm"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
