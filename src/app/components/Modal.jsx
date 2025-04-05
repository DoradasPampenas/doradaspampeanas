'use client';
import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";

export default function Modal({ cerrar }) {
  const { user } = UserAuth();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    aclaracion: "",
    telefono: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const guardarDatos = async () => {
    if (!user?.uid) return;
    try {
      await setDoc(doc(db, "clientes", user.uid), {
        ...formData,
        uid: user.uid,
        email: user.email,
      });
      cerrar();
    } catch (error) {
      console.error("Error al guardar los datos del cliente:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">
          Datos de envío
        </h2>
        <div className="grid gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className="border p-2 rounded-lg"
            value={formData.nombre}
            onChange={handleChange}
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            className="border p-2 rounded-lg"
            value={formData.apellido}
            onChange={handleChange}
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección de envío"
            className="border p-2 rounded-lg"
            value={formData.direccion}
            onChange={handleChange}
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            className="border p-2 rounded-lg"
            value={formData.telefono}
            onChange={handleChange}
          />
          <textarea
            name="aclaracion"
            placeholder="Aclaración (ej: casa roja, portón negro...)"
            className="border p-2 rounded-lg"
            rows={2}
            value={formData.aclaracion}
            onChange={handleChange}
          />
          <button
            onClick={guardarDatos}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold"
          >
            Guardar
          </button>
          <button
            onClick={cerrar}
            className="text-sm text-gray-500 underline mt-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
