'use client'
import { useState } from "react"
import { db } from "../firebase"
import { doc, setDoc } from "firebase/firestore"
import { UserAuth } from "../context/AuthContext"

export default function Modal({ cerrar }) {
  const { user } = UserAuth()

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    aclaracion: "",
    telefono: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const guardarDatos = async () => {
    if (!user?.uid) return
    try {
      await setDoc(doc(db, "clientes", user.uid), {
        ...formData,
        empanadasDoradas: 0,
        docenaDorada: 0,
        uid: user.uid,
        email: user.email,
      })
      cerrar()
    } catch (error) {
      console.error("Error al guardar los datos del cliente:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
          Datos para ENVIO
        </h2>

        <div className="grid gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className="border px-4 py-2 rounded-xl"
            value={formData.nombre}
            onChange={handleChange}
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            className="border px-4 py-2 rounded-xl"
            value={formData.apellido}
            onChange={handleChange}
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            className="border px-4 py-2 rounded-xl"
            value={formData.direccion}
            onChange={handleChange}
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            className="border px-4 py-2 rounded-xl"
            value={formData.telefono}
            onChange={handleChange}
          />
          <textarea
            name="aclaracion"
            placeholder="Aclaración (ej: casa roja, portón negro...)"
            className="border px-4 py-2 rounded-xl resize-none"
            rows={3}
            value={formData.aclaracion}
            onChange={handleChange}
          />

          <button
            onClick={guardarDatos}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-xl"
          >
            Guardar
          </button>

          <button
            onClick={cerrar}
            className="text-sm text-gray-500 underline text-center"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
