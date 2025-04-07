'use client'

import { useEffect, useState } from 'react'
import { db } from '../firebase'
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from 'firebase/firestore'

export default function StockCRUD() {
  const [variedades, setVariedades] = useState([])
  const [seleccion, setSeleccion] = useState({})

  useEffect(() => {
    obtenerVariedades()
  }, [])

  const obtenerVariedades = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'variedades'))
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setVariedades(data)
    } catch (error) {
      console.error('Error al obtener variedades:', error)
    }
  }

  const actualizarStock = async (id) => {
    const sel = seleccion[id] || { unidades: 0, docenas: 0 }
    const cantidadAgregar = (sel.unidades || 0) + (sel.docenas || 0) * 12

    if (cantidadAgregar === 0) return

    try {
      const variedad = variedades.find(v => v.id === id)
      const stockActual = Number(variedad.stock ?? 0)
      const nuevoStock = stockActual + cantidadAgregar
      const docRef = doc(db, 'variedades', id)

      await updateDoc(docRef, { stock: nuevoStock })
      await obtenerVariedades()

      setSeleccion(prev => ({
        ...prev,
        [id]: { unidades: 0, docenas: 0 }
      }))
    } catch (error) {
      console.error('Error al actualizar el stock:', error)
    }
  }

  const handleCantidadChange = (id, tipo, valor) => {
    const anterior = seleccion[id] || { unidades: 0, docenas: 0 }
    const nuevoValor = parseInt(valor, 10) || 0

    setSeleccion(prev => ({
      ...prev,
      [id]: {
        ...anterior,
        [tipo]: nuevoValor
      }
    }))
  }

  const calcularTotalUnidadesPorVariedad = (id) => {
    const sel = seleccion[id] || {}
    return (sel.unidades || 0) + (sel.docenas || 0) * 12
  }

  const calcularIngredientesAComprar = () => {
    const ingredientesTotales = {}

    variedades.forEach(v => {
      const sel = seleccion[v.id] || {}
      const docenas = sel.docenas || 0

      if (docenas > 0 && Array.isArray(v.ingredientes)) {
        v.ingredientes.forEach(ingr => {
          const nombre = ingr.nombre
          const cantidadPorDocena = Number(ingr.cantidad ?? 0)
          const unidad = ingr.unidad || 'g'
          const key = `${nombre} (${unidad})`

          ingredientesTotales[key] = (ingredientesTotales[key] || 0) + (cantidadPorDocena * docenas)
        })
      }
    })

    return ingredientesTotales
  }

  const calcularGananciasProyectadas = () => {
    return variedades.reduce(
      (acc, v) => {
        const stock = Number(v.stock ?? 0)
        const precio = Number(v.precioSugeridoDocena ?? 0)
        acc.totalStock += stock
        acc.totalDinero += precio * Math.floor(stock / 12)
        return acc
      },
      { totalStock: 0, totalDinero: 0 }
    )
  }

  const mostrarDocenasYUnidades = (totalUnidades) => {
    const docenas = Math.floor(totalUnidades / 12)
    const unidades = totalUnidades % 12
    return `${docenas} docenas y ${unidades} unidades`
  }

  const ingredientesAComprar = calcularIngredientesAComprar()
  const { totalStock, totalDinero } = calcularGananciasProyectadas()

  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-4xl mx-auto space-y-10">
      <h2 className="text-xl font-bold mb-4 text-orange-600">Control de Stock y Proyección</h2>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">📦 Cantidades a producir por variedad</h3>
        {variedades.map(v => {
          const sel = seleccion[v.id] || { unidades: 0, docenas: 0 }
          const total = calcularTotalUnidadesPorVariedad(v.id)

          return (
            <div key={v.id} className="p-3 border rounded bg-gray-50 shadow-sm space-y-2">
              <h4 className="font-semibold">{v.nombre}</h4>
              <h3 className="text-orange-600 font-semibold">{v.tipoCoccion}</h3>
              <p className="text-sm text-gray-700">
                Stock actual: <span className="font-medium">{v.stock ?? 0} unidades</span> (
                {mostrarDocenasYUnidades(Number(v.stock ?? 0))})
              </p>
              <p className="text-sm text-gray-600">Costo por docena: ${v.costoDocena ?? '-'}</p>
              <p className="text-sm text-gray-600">Precio sugerido docena: ${v.precioSugeridoDocena ?? '-'}</p>

              <div className="flex gap-4 mt-1 items-center text-sm">
                <label htmlFor={`docenas-${v.id}`}>Agregar docenas:</label>
                <input
                  id={`docenas-${v.id}`}
                  type="number"
                  min={-100}
                  value={sel.docenas}
                  onChange={(e) => handleCantidadChange(v.id, 'docenas', e.target.value)}
                  className="w-20 px-2 py-1 border rounded"
                />
                <label htmlFor={`unidades-${v.id}`}>Agregar unidades:</label>
                <input
                  id={`unidades-${v.id}`}
                  type="number"
                  min={-100}
                  value={sel.unidades}
                  onChange={(e) => handleCantidadChange(v.id, 'unidades', e.target.value)}
                  className="w-20 px-2 py-1 border rounded"
                />

                <button
                  onClick={() => actualizarStock(v.id)}
                  className="ml-auto bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                >
                  Actualizar stock
                </button>
              </div>

              {total !== 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Se agregarán: {total} unidades ({mostrarDocenasYUnidades(total)})
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border">
        <h3 className="text-lg font-bold text-yellow-700 mb-2">🛒 Ingredientes a comprar</h3>
        {Object.keys(ingredientesAComprar).length === 0 ? (
          <p className="text-sm text-gray-500">Aún no seleccionaste cantidades.</p>
        ) : (
          <ul className="list-disc list-inside text-sm">
            {Object.entries(ingredientesAComprar).map(([nombreUnidad, cantidad]) => (
              <li key={nombreUnidad}>{nombreUnidad}: {cantidad.toFixed(2)}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-green-50 p-4 rounded-lg border">
        <h3 className="text-lg font-bold text-green-700 mb-2">💰 Ganancia proyectada (según stock actual)</h3>
        <p className="text-sm">
          Total empanadas disponibles: <span className="font-semibold">{totalStock}</span>
        </p>
        <p className="text-sm">
          Ingreso estimado: <span className="font-semibold">${totalDinero.toFixed(2)}</span>
        </p>
      </div>
    </div>
  )
}
