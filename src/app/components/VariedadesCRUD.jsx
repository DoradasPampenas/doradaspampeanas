'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
import { db } from '../firebase'

export default function Variedades() {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [tipoCoccion, setTipoCoccion] = useState('horno')
  const [rutaImagen, setRutaImagen] = useState('')
  const [ingredientes, setIngredientes] = useState([])
  const [unidad, setUnidad] = useState('')
  const [nombreIng, setNombreIng] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [precio, setPrecio] = useState('')
  const [gananciaDeseada, setGananciaDeseada] = useState(50)
  const [variedades, setVariedades] = useState([])
  const [modoEdicion, setModoEdicion] = useState(null)

  useEffect(() => {
    cargarVariedades()
  }, [])

  const cargarVariedades = async () => {
    const variedadesRef = collection(db, 'variedades')
    const q = query(variedadesRef, orderBy('timestamp', 'desc'))
    const snapshot = await getDocs(q)
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setVariedades(docs)
  }

  const agregarIngrediente = () => {
    if (unidad && cantidad && precio && nombreIng) {
      setIngredientes(prev => [
        ...prev,
        {
          nombre: nombreIng,
          unidad,
          cantidad: parseFloat(cantidad),
          precio: parseFloat(precio)
        }
      ])
      setUnidad('')
      setCantidad('')
      setPrecio('')
      setNombreIng('')
    }
  }

  const calcularCostoPorDocena = () => {
    return ingredientes.reduce(
      (acc, ing) => acc + ing.cantidad * ing.precio,
      0
    )
  }

  const calcularPrecioSugerido = () => {
    const costo = calcularCostoPorDocena()
    return costo + (costo * gananciaDeseada) / 100
  }

  const guardarVariedad = async () => {
    if (!nombre || !rutaImagen || ingredientes.length === 0) {
      alert('Faltan campos obligatorios')
      return
    }

    const data = {
      nombre,
      descripcion,
      tipoCoccion,
      imagen: rutaImagen,
      ingredientes,
      stock: 0,
      costoDocena: calcularCostoPorDocena(),
      precioSugeridoDocena: calcularPrecioSugerido(),
      gananciaPorcentaje: gananciaDeseada,
      timestamp: Date.now()
    }

    try {
      if (modoEdicion) {
        const ref = doc(db, 'variedades', modoEdicion)
        await updateDoc(ref, data)
        setVariedades(prev =>
          prev.map(v => (v.id === modoEdicion ? { ...data, id: modoEdicion } : v))
        )
      } else {
        const docRef = await addDoc(collection(db, 'variedades'), data)
        setVariedades(prev => [{ ...data, id: docRef.id }, ...prev])
      }

      resetearFormulario()
    } catch (error) {
      console.error('Error al guardar variedad:', error)
    }
  }

  const resetearFormulario = () => {
    setNombre('')
    setDescripcion('')
    setTipoCoccion('horno')
    setRutaImagen('')
    setIngredientes([])
    setUnidad('')
    setNombreIng('')
    setCantidad('')
    setPrecio('')
    setGananciaDeseada(50)
    setModoEdicion(null)
  }

  const prepararEdicion = variedad => {
    setNombre(variedad.nombre)
    setDescripcion(variedad.descripcion || '')
    setTipoCoccion(variedad.tipoCoccion)
    setRutaImagen(variedad.imagen)
    setIngredientes(variedad.ingredientes)
    setGananciaDeseada(variedad.gananciaPorcentaje)
    setModoEdicion(variedad.id)
  }

  const eliminarVariedad = async id => {
    if (confirm('¿Eliminar esta variedad?')) {
      await deleteDoc(doc(db, 'variedades', id))
      setVariedades(prev => prev.filter(v => v.id !== id))
    }
  }

  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold">{modoEdicion ? 'Editar variedad' : 'Nueva variedad'}</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        className={`w-full p-2 border rounded ${!nombre && 'border-red-500'}`}
      />

      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={e => setDescripcion(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <select
        value={tipoCoccion}
        onChange={e => setTipoCoccion(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="horno">Horno</option>
        <option value="frito">Frito</option>
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={e => {
          const file = e.target.files[0]
          if (file) {
            setRutaImagen(`/imagenes/variedades/${file.name}`)
          }
        }}
        className={`w-full p-2 border rounded ${!rutaImagen && 'border-red-500'}`}
      />

      {rutaImagen && (
        <img
          src={rutaImagen}
          alt="preview"
          className="w-32 h-32 object-cover rounded mt-2 border"
        />
      )}

      <div className="border-t pt-4">
        <h3 className="font-semibold">Ingredientes por docena</h3>
        <div className="grid grid-cols-4 gap-2 mt-2">
          <input type="text" placeholder="Nombre" value={nombreIng} onChange={e => setNombreIng(e.target.value)} className="p-2 border rounded" />
          <input type="text" placeholder="Unidad" value={unidad} onChange={e => setUnidad(e.target.value)} className="p-2 border rounded" />
          <input type="number" placeholder="Cantidad" value={cantidad} onChange={e => setCantidad(e.target.value)} className="p-2 border rounded" />
          <input type="number" placeholder="Precio" value={precio} onChange={e => setPrecio(e.target.value)} className="p-2 border rounded" />
        </div>

        <button onClick={agregarIngrediente} className="mt-2 bg-blue-600 text-white px-4 py-1 rounded">Agregar ingrediente</button>

        <ul className="mt-3 text-sm">
          {ingredientes.map((ing, i) => (
            <li key={i}>
              {ing.nombre} — {ing.cantidad} {ing.unidad} × ${ing.precio} = ${(ing.cantidad * ing.precio).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 space-y-2">
        <p><strong>Costo por docena:</strong> ${calcularCostoPorDocena().toFixed(2)}</p>
        <label className="block">
          Ganancia deseada (%):
          <input type="number" value={gananciaDeseada} onChange={e => setGananciaDeseada(parseFloat(e.target.value))} className="ml-2 w-20 p-1 border rounded" />
        </label>
        <p><strong>Precio sugerido:</strong> ${calcularPrecioSugerido().toFixed(2)}</p>
      </div>

      <button onClick={guardarVariedad} className="w-full mt-4 bg-green-600 text-white p-2 rounded">
        {modoEdicion ? 'Actualizar variedad' : 'Guardar variedad'}
      </button>

      {modoEdicion && (
        <button onClick={resetearFormulario} className="w-full mt-2 bg-gray-400 text-white p-2 rounded">
          Cancelar edición
        </button>
      )}

      <hr className="my-6" />

      <h2 className="text-lg font-bold">Variedades registradas</h2>
      <ul className="space-y-2">
        {variedades.map((v, i) => (
          <li key={i} className="border p-2 rounded flex items-center gap-4">
            {v.imagen && <img src={v.imagen} alt={v.nombre} className="w-16 h-16 object-cover rounded" />}
            <div className="flex-1">
              <p className="font-semibold">{v.nombre}</p>
              <p>{v.descripcion}</p>
              <p>Tipo: {v.tipoCoccion}</p>
              <p>Costo: ${v.costoDocena?.toFixed(2)} | Precio sugerido: ${v.precioSugeridoDocena?.toFixed(2)}</p>
              <p>Ingredientes: {v.ingredientes?.length}</p>
              <p>Stock: {v.stock}</p>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => prepararEdicion(v)} className="text-blue-600 underline text-sm">Editar</button>
              <button onClick={() => eliminarVariedad(v.id)} className="text-red-600 underline text-sm">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
