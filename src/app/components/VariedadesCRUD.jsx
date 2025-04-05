'use client'

import { useEffect, useState } from 'react'
import { db } from '../firebase'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'

export default function VariedadesCRUD() {
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [tipo, setTipo] = useState('horno')
  const [imagen, setImagen] = useState(null)
  const [imagenNombre, setImagenNombre] = useState('')
  const [preview, setPreview] = useState(null)

  const [ingredientes, setIngredientes] = useState([])
  const [ingredienteNombre, setIngredienteNombre] = useState('')
  const [ingredientePrecio, setIngredientePrecio] = useState('')
  const [ingredienteGramos, setIngredienteGramos] = useState('')

  const [editandoId, setEditandoId] = useState(null)
  const [variedades, setVariedades] = useState([])

  const variedadesRef = collection(db, 'variedades')

  const obtenerVariedades = () => {
    getDocs(variedadesRef).then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setVariedades(data)
    })
  }

  useEffect(() => {
    obtenerVariedades()
  }, [])

  const agregarIngrediente = () => {
    if (!ingredienteNombre || !ingredientePrecio || !ingredienteGramos) return
    setIngredientes([
      ...ingredientes,
      {
        nombre: ingredienteNombre,
        precio: parseFloat(ingredientePrecio),
        gramos: parseFloat(ingredienteGramos),
      },
    ])
    setIngredienteNombre('')
    setIngredientePrecio('')
    setIngredienteGramos('')
  }

  const quitarIngrediente = (index) => {
    setIngredientes(ingredientes.filter((_, i) => i !== index))
  }

  const handleAgregar = () => {
    if (!nombre || !precio) return
    const urlImagen = imagen ? `/imagenes/variedades/${imagen.name}` : ''
    addDoc(variedadesRef, {
      nombre,
      precio,
      descripcion,
      tipo,
      imagen: urlImagen,
      ingredientes,
      vendidas: 0,
      produccion: 0,
      imprimiendo: 0,
      impresas: 0,
    }).then(() => {
      limpiarFormulario()
      obtenerVariedades()
    })
  }

  const handleEliminar = (id) => {
    deleteDoc(doc(db, 'variedades', id)).then(() => obtenerVariedades())
  }

  const handleEditar = (variedad) => {
    setEditandoId(variedad.id)
    setNombre(variedad.nombre)
    setPrecio(variedad.precio)
    setDescripcion(variedad.descripcion || '')
    setTipo(variedad.tipo || 'horno')
    setImagenNombre(variedad.imagen?.split('/').pop() || '')
    setPreview(variedad.imagen || null)
    setImagen(null)
    setIngredientes(variedad.ingredientes || [])
  }

  const handleActualizar = () => {
    if (!editandoId) return
    const docRef = doc(db, 'variedades', editandoId)
    const urlImagen = imagen
      ? `/imagenes/variedades/${imagen.name}`
      : imagenNombre
      ? `/imagenes/variedades/${imagenNombre}`
      : ''
    updateDoc(docRef, {
      nombre,
      precio,
      descripcion,
      tipo,
      imagen: urlImagen,
      ingredientes,
    }).then(() => {
      limpiarFormulario()
      obtenerVariedades()
    })
  }

  const limpiarFormulario = () => {
    setEditandoId(null)
    setNombre('')
    setPrecio('')
    setDescripcion('')
    setTipo('horno')
    setImagen(null)
    setImagenNombre('')
    setPreview(null)
    setIngredientes([])
    setIngredienteNombre('')
    setIngredientePrecio('')
    setIngredienteGramos('')
  }

  const calcularPrecioSugerido = () => {
    const base = parseFloat(precio)
    return isNaN(base) ? '0.00' : (base * 1.3).toFixed(2)
  }

  return (
    <div className="w-full p-4 bg-white rounded-2xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">Variedades</h2>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Nombre de la empanada"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Precio base"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-sm text-gray-500">
          Precio sugerido: ${calcularPrecioSugerido()}
        </p>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="horno">Al horno</option>
          <option value="frita">Frita</option>
        </select>
        <textarea
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0]
            setImagen(file)
            setImagenNombre(file?.name || '')
            setPreview(file ? URL.createObjectURL(file) : null)
          }}
          className="w-full border rounded px-3 py-2"
        />
        {preview && (
          <img
            src={preview}
            alt="Vista previa"
            className="w-32 h-32 object-cover rounded mb-2"
          />
        )}

        <div className="border p-3 rounded bg-gray-50 mb-2">
          <h4 className="font-semibold mb-2 text-gray-700">Ingredientes</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            <input
              type="text"
              placeholder="Nombre"
              value={ingredienteNombre}
              onChange={(e) => setIngredienteNombre(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <input
              type="number"
              placeholder="Precio"
              value={ingredientePrecio}
              onChange={(e) => setIngredientePrecio(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <input
              type="number"
              placeholder="Gramos"
              value={ingredienteGramos}
              onChange={(e) => setIngredienteGramos(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <button
              onClick={agregarIngrediente}
              className="bg-orange-500 text-white px-3 rounded hover:bg-orange-600"
            >
              +
            </button>
          </div>
          {ingredientes.length > 0 && (
            <ul className="text-sm list-disc pl-5 text-gray-700">
              {ingredientes.map((ing, i) => (
                <li key={i}>
                  {ing.nombre} (${ing.precio} - {ing.gramos}g)
                  <button
                    onClick={() => quitarIngrediente(i)}
                    className="ml-2 text-red-500 text-xs hover:underline"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {editandoId ? (
          <button
            onClick={handleActualizar}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Actualizar
          </button>
        ) : (
          <button
            onClick={handleAgregar}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Agregar
          </button>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Lista de Variedades</h3>
        {variedades.map((v) => (
          <div
            key={v.id}
            className="flex justify-between items-center bg-orange-50 p-2 rounded-lg mb-2"
          >
            <div className="flex items-center gap-4">
              {v.imagen && (
                <img
                  src={v.imagen}
                  alt={v.nombre}
                  className="w-16 h-16 rounded object-cover"
                />
              )}
              <div>
                <p className="font-medium">{v.nombre}</p>
                <p className="text-sm text-gray-600">
                  ${v.precio} | Sugerido: ${(parseFloat(v.precio) * 1.3).toFixed(2)}
                </p>
                {v.tipo && (
                  <p className="text-sm text-gray-500 capitalize">{v.tipo}</p>
                )}
                {v.descripcion && (
                  <p className="text-xs text-gray-500">{v.descripcion}</p>
                )}
                {v.ingredientes && v.ingredientes.length > 0 && (
                  <ul className="text-xs text-gray-600 list-disc pl-4">
                    {v.ingredientes.map((ing, i) => (
                      <li key={i}>
                        {ing.nombre} (${ing.precio} - {ing.gramos}g)
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEditar(v)}
                className="text-blue-600 hover:underline text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminar(v.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
