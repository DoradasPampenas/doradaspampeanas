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
    const snapshot = await getDocs(collection(db, 'variedades'))
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setVariedades(data)
  }

  const actualizarStock = async (id, cantidadAgregar) => {
    const variedad = variedades.find(v => v.id === id)
    const nuevoStock = (variedad.stock || 0) + cantidadAgregar
    const docRef = doc(db, 'variedades', id)
    await updateDoc(docRef, { stock: nuevoStock })
    obtenerVariedades()
    setSeleccion({ ...seleccion, [id]: { unidades: 0, docenas: 0 } })
  }

  const handleCantidadChange = (id, tipo, valor) => {
    const anterior = seleccion[id] || { unidades: 0, docenas: 0 }
    setSeleccion({
      ...seleccion,
      [id]: {
        ...anterior,
        [tipo]: parseInt(valor) || 0
      }
    })
  }

  const calcularTotalUnidadesPorVariedad = (id) => {
    const sel = seleccion[id] || {}
    return (sel.unidades || 0) + (sel.docenas || 0) * 12
  }

  const calcularIngredientesAComprar = () => {
    const ingredientesTotales = {}

    variedades.forEach((v) => {
      const unidades = calcularTotalUnidadesPorVariedad(v.id)
      if (unidades > 0) {
        v.ingredientes?.forEach((ingr) => {
          if (!ingredientesTotales[ingr.nombre]) {
            ingredientesTotales[ingr.nombre] = 0
          }
          ingredientesTotales[ingr.nombre] += ingr.gramos * unidades
        })
      }
    })

    return ingredientesTotales
  }

  const calcularGananciasProyectadas = () => {
    let totalStock = 0
    let totalDinero = 0

    variedades.forEach((v) => {
      const stock = v.stock || 0
      const precio = parseFloat(v.precio) || 0
      totalStock += stock
      totalDinero += stock * precio
    })

    return { totalStock, totalDinero }
  }

  const ingredientesAComprar = calcularIngredientesAComprar()
  const { totalStock, totalDinero } = calcularGananciasProyectadas()

  const mostrarDocenasYUnidades = (totalUnidades) => {
    const docenas = Math.floor(totalUnidades / 12)
    const unidades = totalUnidades % 12
    return `${docenas} docenas y ${unidades} unidades`
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-4xl mx-auto space-y-10">
      <h2 className="text-xl font-bold mb-4 text-orange-600">Control de Stock y Proyección</h2>

      {/* Selección por variedad */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">📦 Cantidades a producir por variedad</h3>
        {variedades.map((v) => {
          const sel = seleccion[v.id] || { unidades: 0, docenas: 0 }
          const total = calcularTotalUnidadesPorVariedad(v.id)

          return (
            <div key={v.id} className="p-3 border rounded bg-gray-50 shadow-sm space-y-2">
              <h4 className="font-semibold">{v.nombre}</h4>
              <p className="text-sm text-gray-700">
                Stock actual: <span className="font-medium">{v.stock} unidades</span> (
                {mostrarDocenasYUnidades(v.stock || 0)})
              </p>

              <div className="flex gap-4 mt-1 items-center text-sm">
                <label>Agregar docenas:</label>
                <input
                  type="number"
                  min={-100}
                  value={sel.docenas}
                  onChange={(e) => handleCantidadChange(v.id, 'docenas', e.target.value)}
                  className="w-20 px-2 py-1 border rounded"
                />
                <label>Agregar unidades:</label>
                <input
                  type="number"
                  min={-100}
                  value={sel.unidades}
                  onChange={(e) => handleCantidadChange(v.id, 'unidades', e.target.value)}
                  className="w-20 px-2 py-1 border rounded"
                />

                <button
                  onClick={() => actualizarStock(v.id, total)}
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

      {/* Ingredientes a comprar */}
      <div className="bg-yellow-50 p-4 rounded-lg border">
        <h3 className="text-lg font-bold text-yellow-700 mb-2">🛒 Ingredientes a comprar</h3>
        {Object.keys(ingredientesAComprar).length === 0 ? (
          <p className="text-sm text-gray-500">Aún no seleccionaste cantidades.</p>
        ) : (
          <ul className="list-disc list-inside text-sm">
            {Object.entries(ingredientesAComprar).map(([nombre, gramos]) => (
              <li key={nombre}>{nombre}: {gramos}g</li>
            ))}
          </ul>
        )}
      </div>

      {/* Ganancias */}
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
