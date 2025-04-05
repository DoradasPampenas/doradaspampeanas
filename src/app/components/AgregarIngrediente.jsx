"use client";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

export default function IngredientesForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    unidad: "g",
    cantidad: 0,
    precioActual: 0,
    requiereHeladera: false,
    categoria: "",
  });
  const [ingredientes, setIngredientes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [editandoID, setEditandoID] = useState(null); // null si estás agregando

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const obtenerProximoID = async () => {
    const q = query(collection(db, "ingredientes"), orderBy("id", "desc"), limit(1));
    const snap = await getDocs(q);
    const ultimo = snap.docs[0]?.data();
    return ultimo?.id ? ultimo.id + 1 : 1;
  };

  const guardarIngrediente = async () => {
    if (!formData.nombre) return setMensaje("❗ Completá el nombre");

    if (editandoID) {
      const q = query(collection(db, "ingredientes"));
      const snap = await getDocs(q);
      const docEdit = snap.docs.find((doc) => doc.data().id === editandoID);

      if (docEdit) {
        updateDoc(doc(db, "ingredientes", docEdit.id), {
          ...formData,
          cantidad: parseFloat(formData.cantidad),
          precioActual: parseFloat(formData.precioActual),
          fechaActualizacion: Timestamp.now(),
        }).then(() => {
          setMensaje("✅ Ingrediente actualizado");
          setFormData(initialState);
          setEditandoID(null);
        });
      }
    } else {
      const nuevoID = await obtenerProximoID();
      const nuevo = {
        ...formData,
        id: nuevoID,
        cantidad: parseFloat(formData.cantidad),
        precioActual: parseFloat(formData.precioActual),
        fechaActualizacion: Timestamp.now(),
        activo: true,
      };
      addDoc(collection(db, "ingredientes"), nuevo)
        .then(() => {
          setMensaje("✅ Ingrediente agregado");
          setFormData(initialState);
        })
        .catch(() => setMensaje("⚠️ Error al guardar"));
    }
  };

  const editarIngrediente = (ing) => {
    setFormData({
      nombre: ing.nombre,
      unidad: ing.unidad,
      cantidad: ing.cantidad,
      precioActual: ing.precioActual,
      requiereHeladera: ing.requiereHeladera,
      categoria: ing.categoria,
    });
    setEditandoID(ing.id);
  };

  const initialState = {
    nombre: "",
    unidad: "g",
    cantidad: 0,
    precioActual: 0,
    requiereHeladera: false,
    categoria: "",
  };

  useEffect(() => {
    const q = query(collection(db, "ingredientes"), orderBy("id", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const lista = snap.docs.map((doc) => doc.data());
      setIngredientes(lista);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🧂 {editandoID ? "Editar" : "Agregar"} Ingrediente</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Ej: Sal fina"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Unidad</label>
          <select name="unidad" value={formData.unidad} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="g">Gramos (g)</option>
            <option value="kg">Kilos (kg)</option>
            <option value="unidad">Unidad</option>
            <option value="ml">Mililitros (ml)</option>
            <option value="l">Litros (l)</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Cantidad</label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Precio por unidad</label>
          <input
            type="number"
            name="precioActual"
            value={formData.precioActual}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Categoría</label>
          <input
            type="text"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Ej: Condimento, vegetal..."
          />
        </div>

        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="requiereHeladera"
            checked={formData.requiereHeladera}
            onChange={handleChange}
          />
          <label className="text-sm text-gray-600">Requiere heladera</label>
        </div>
      </div>

      <button
        onClick={guardarIngrediente}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        {editandoID ? "Actualizar Ingrediente" : "Guardar Ingrediente"}
      </button>

      {mensaje && <p className="text-sm text-blue-600 mt-2">{mensaje}</p>}

      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-4">📋 Lista de Ingredientes</h3>
      <ul className="grid gap-3">
        {ingredientes.map((ing) => (
          <li
            key={ing.id}
            className="p-4 border rounded bg-gray-50 flex justify-between items-start flex-wrap gap-2"
          >
            <div>
              <strong className="text-lg">{ing.nombre}</strong>
              <p className="text-sm text-gray-600">
                {ing.cantidad} {ing.unidad} | ${ing.precioActual} | {ing.categoria || "Sin categoría"} |{" "}
                {ing.requiereHeladera ? "❄️ Heladera" : "Ambiente"}
              </p>
            </div>
            <button
              onClick={() => editarIngrediente(ing)}
              className="text-sm text-blue-600 hover:underline"
            >
              ✏️ Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
