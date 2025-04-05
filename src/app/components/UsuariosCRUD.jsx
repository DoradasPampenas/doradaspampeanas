'use client'

import { useEffect, useState } from 'react'
import { db } from '../firebase'
import {
  collection,
  getDocs,
  deleteDoc,
  doc
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

  useEffect(() => {
    obtenerUsuarios()
  }, [])

  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-orange-600">Gestión de Usuarios</h2>
      {usuarios.map(u => (
        <div key={u.id} className="flex justify-between items-center bg-orange-50 p-2 rounded mb-2">
          <div>
            <p>{u.nombre || u.email}</p>
            <p className="text-sm text-gray-500">{u.email}</p>
          </div>
          <button
            onClick={() => eliminarUsuario(u.id)}
            className="text-red-600 hover:underline text-sm"
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  )
}
