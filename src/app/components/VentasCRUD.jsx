'use client'

import { useEffect, useState } from 'react'
import { db } from '../firebase'
import {
  collection, getDocs, addDoc, doc, updateDoc
} from 'firebase/firestore'

export default function CargaManualVenta() {
  const [cliente, setCliente] = useState({
    nombre: '', apellido: '', direccion: '', telefono: '', observaciones: ''
  })

  const [metodoPago, setMetodoPago] = useState('')
  const [pedido, setPedido] = useState([{ tipo: '', cantidad: 1 }])
  const [mensaje, setMensaje] = useState('')
  const [variedades, setVariedades] = useState([])
  const [ventas, setVentas] = useState([])
  const [cargando, setCargando] = useState(true)
  
  // Estados de pedido disponibles
  const estadosPedido = [
    'PEDIDO TOMADO',
    'PEDIDO ENVIADO',
    'PEDIDO RECIBIDO',
    'PEDIDO FINALIZADO'
  ]

  useEffect(() => {
    Promise.all([obtenerVariedades(), obtenerVentas()])
      .finally(() => setCargando(false))
  }, [])

  const obtenerVariedades = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'variedades'))
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setVariedades(data)
    } catch (error) {
      setMensaje('❌ Error al obtener variedades.')
    }
  }

  const actualizarEstadoVenta = async (idVenta, nuevoEstado) => {
    try {
      const snapshot = await getDocs(collection(db, 'ventas'))
      const ventaDoc = snapshot.docs.find(doc => doc.data().id === idVenta)
      if (ventaDoc) {
        const ref = doc(db, 'ventas', ventaDoc.id)
        await updateDoc(ref, { estado: nuevoEstado })
        setVentas(prev => prev.map(v => v.id === idVenta ? { ...v, estado: nuevoEstado } : v))
        setMensaje('✅ Estado actualizado correctamente.')
      } else {
        setMensaje('❌ Venta no encontrada.')
      }
    } catch (error) {
      console.error(error)
      setMensaje('❌ Error al actualizar estado.')
    }
  }

  const obtenerVentas = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'ventas'))
      const data = snapshot.docs.map(doc => doc.data())
      const ordenadas = data.sort((a, b) => b.id - a.id)
      setVentas(ordenadas)
    } catch (error) {
      setMensaje('❌ Error al obtener ventas.')
    }
  }

  const agregarVariedad = () => {
    setPedido([...pedido, { tipo: '', cantidad: 1 }])
  }

  const actualizarVariedad = (index, campo, valor) => {
    const nuevoPedido = [...pedido]
    nuevoPedido[index][campo] = campo === 'cantidad' ? parseInt(valor) || 1 : valor
    setPedido(nuevoPedido)
  }

  const obtenerPrecioUnidad = (nombreVariedad) => {
    const variedad = variedades.find(v => v.nombre === nombreVariedad)
    if (!variedad || !variedad.precioSugeridoDocena) return 0
    return variedad.precioSugeridoDocena / 12
  }

  const total = pedido.reduce((acc, item) => {
    if (!item.tipo) return acc
    const precioUnidad = obtenerPrecioUnidad(item.tipo)
    return acc + (item.cantidad || 0) * precioUnidad
  }, 0)

  const obtenerNuevoId = async () => {
    const snapshot = await getDocs(collection(db, 'ventas'))
    const ids = snapshot.docs.map(doc => parseInt(doc.data().id)).filter(n => !isNaN(n))
    return ids.length ? Math.max(...ids) + 1 : 1
  }

  const validarStock = () => {
    const resumen = {}
    for (let item of pedido) {
      if (!item.tipo) return 'Falta seleccionar una variedad.'
      if (!item.cantidad || item.cantidad <= 0) return 'Cantidad inválida.'
      resumen[item.tipo] = (resumen[item.tipo] || 0) + item.cantidad
    }
    for (let tipo in resumen) {
      const variedad = variedades.find(v => v.nombre === tipo)
      if (!variedad) return `La variedad ${tipo} no existe.`
      if (resumen[tipo] > variedad.stock) {
        return `No hay suficiente stock de ${tipo}. Disponibles: ${variedad.stock}`
      }
    }
    if (!metodoPago) return 'Seleccioná el método de pago.'
    return null
  }

  const restarStock = async () => {
    const updates = pedido.map(async (item) => {
      const variedad = variedades.find(v => v.nombre === item.tipo)
      if (variedad) {
        const ref = doc(db, 'variedades', variedad.id)
        await updateDoc(ref, { stock: variedad.stock - item.cantidad })
      }
    })
    await Promise.all(updates)
  }

  const limpiarFormulario = () => {
    setCliente({ nombre: '', apellido: '', direccion: '', telefono: '', observaciones: '' })
    setPedido([{ tipo: '', cantidad: 1 }])
    setMetodoPago('')
  }

  const guardarVenta = async () => {
    setMensaje('')
    const error = validarStock()
    if (error) {
      setMensaje(`❌ ${error}`)
      return
    }
    try {
      const nuevoId = await obtenerNuevoId()
      const nuevaVenta = {
        id: nuevoId,
        cliente: {
          ...cliente,
          nombre: cliente.nombre.trim(),
          apellido: cliente.apellido.trim()
        },
        metodoPago,
        pedido: pedido.map(p => ({
          tipo: p.tipo,
          cantidad: p.cantidad,
          precioUnidad: obtenerPrecioUnidad(p.tipo)
        })),
        total: parseFloat(total.toFixed(2)),
        estado: 'PEDIDO TOMADO',
        fecha: new Date().toISOString()
      }
      await addDoc(collection(db, 'ventas'), nuevaVenta)
      await restarStock()
      await obtenerVariedades()
      await obtenerVentas()
      limpiarFormulario()
      setMensaje('✅ Venta registrada correctamente.')
    } catch (err) {
      console.error(err)
      setMensaje('❌ Error al guardar la venta.')
    }
  }

  if (cargando) return <p className="p-4 text-xl text-orange-600">Cargando...</p>

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white shadow-xl rounded-3xl border border-orange-300 space-y-8">
      <h2 className="text-4xl font-extrabold text-orange-700">Registrar Venta Manual</h2>

      {/* Cliente */}
      <div className="grid sm:grid-cols-2 gap-6">
        {['nombre', 'apellido', 'direccion', 'telefono'].map((campo) => (
          <label key={campo}>
            <span className="block font-semibold capitalize text-gray-700">{campo}:</span>
            <input
              className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={cliente[campo]}
              onChange={(e) => setCliente({ ...cliente, [campo]: e.target.value })}
              required
            />
          </label>
        ))}
        <label className="sm:col-span-2">
          <span className="block font-semibold text-gray-700">Observaciones:</span>
          <textarea
            className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={cliente.observaciones}
            onChange={(e) => setCliente({ ...cliente, observaciones: e.target.value })}
          />
        </label>
        <label className="sm:col-span-2">
          <span className="block font-semibold text-gray-700">Método de pago:</span>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          >
            <option value="">-- Seleccionar --</option>
            <option value="mercado pago">Mercado Pago</option>
            <option value="transferencia">Transferencia</option>
            <option value="efectivo">Efectivo</option>
          </select>
        </label>
      </div>

      {/* Pedido */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800">Pedido</h3>
        {pedido.map((item, index) => {
          const variedad = variedades.find(v => v.nombre === item.tipo)
          const stockActual = variedad?.stock ?? 0
          const precioUnidad = obtenerPrecioUnidad(item.tipo)
          return (
            <div key={index} className="flex flex-wrap items-end gap-4 mb-3 border-b pb-2">
              <label className="flex-1">
                <span className="text-sm font-medium text-gray-700">Variedad:</span>
                <select
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  value={item.tipo}
                  onChange={(e) => actualizarVariedad(index, 'tipo', e.target.value)}
                >
                  <option value="">-- Elegir --</option>
                  {variedades.map((v) => (
                    <option key={v.id} value={v.nombre}>{v.nombre}</option>
                  ))}
                </select>
              </label>
              <label className="w-28">
                <span className="text-sm font-medium text-gray-700">Cantidad:</span>
                <input
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  type="number"
                  min="1"
                  max={stockActual}
                  value={item.cantidad}
                  onChange={(e) => actualizarVariedad(index, 'cantidad', e.target.value)}
                />
              </label>
              <span className="text-sm text-gray-500">Stock: {stockActual}</span>
              {item.tipo && (
                <span className="text-sm text-gray-600">
                  Precio: ${precioUnidad.toFixed(2)}/u
                </span>
              )}
            </div>
          )
        })}
        <button onClick={agregarVariedad} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 mt-2">
          + Agregar Variedad
        </button>
        <p className="text-right font-bold text-2xl text-green-700 mt-4">
          Total: ${total.toFixed(2)}
        </p>
      </div>

      <button onClick={guardarVenta} className="w-full bg-green-600 text-white font-semibold py-4 rounded-xl text-lg hover:bg-green-700">
        Registrar Venta
      </button>

      {mensaje && <p className="text-center text-lg mt-2" className={mensaje.includes('❌') ? 'text-red-600' : 'text-green-600'}>{mensaje}</p>}

      {/* Ventas */}
      {/* VENTAS NO FINALIZADAS */}
      <div className="space-y-16">

{/* Ventas en proceso */}
<div>
  <h3 className="text-2xl font-bold text-gray-800 mb-4">Ventas en Proceso</h3>
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-300 text-sm text-center">
      <thead className="bg-orange-100 text-gray-800">
        <tr>
          <th className="py-2 px-4 border">#</th>
          <th className="py-2 px-4 border">Cliente</th>
          <th className="py-2 px-4 border">Teléfono</th>
          <th className="py-2 px-4 border">Observaciones</th>
          <th className="py-2 px-4 border">Total</th>
          <th className="py-2 px-4 border">Pago</th>
          <th className="py-2 px-4 border">Estado</th>
          <th className="py-2 px-4 border">Fecha</th>
          <th className="py-2 px-4 border">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ventas
          .filter((venta) => venta.estado !== "PEDIDO FINALIZADO")
          .map((venta, i) => (
            <tr key={i} className="border-t">
              <td className="py-2 px-4 border">{venta.id}</td>
              <td className="py-2 px-4 border">{venta.cliente?.nombre} {venta.cliente?.apellido}</td>
              <td className="py-2 px-4 border">{venta.cliente?.telefono}</td>
              <td className="py-2 px-4 border">{venta.cliente?.observaciones}</td>
              <td className="py-2 px-4 border">${venta.total}</td>
              <td className="py-2 px-4 border capitalize">{venta.metodoPago}</td>
              <td className="py-2 px-4 border">{venta.estado}</td>
              <td className="py-2 px-4 border">{new Date(venta.fecha).toLocaleDateString()}</td>
              <td className="py-2 px-4 border">
                <select
                  className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={venta.estado}
                  onChange={(e) => actualizarEstadoVenta(venta.id, e.target.value)}
                >
                  {estadosPedido.map((estado) => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </td>
            </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

{/* Ventas finalizadas */}
<div>
  <h3 className="text-2xl font-bold text-gray-800 mb-4">Ventas Finalizadas</h3>
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-300 text-sm text-center">
      <thead className="bg-green-100 text-gray-800">
        <tr>
          <th className="py-2 px-4 border">#</th>
          <th className="py-2 px-4 border">Cliente</th>
          <th className="py-2 px-4 border">Teléfono</th>
          <th className="py-2 px-4 border">Observaciones</th>
          <th className="py-2 px-4 border">Total</th>
          <th className="py-2 px-4 border">Pago</th>
          <th className="py-2 px-4 border">Estado</th>
          <th className="py-2 px-4 border">Fecha</th>
        </tr>
      </thead>
      <tbody>
        {ventas
          .filter((venta) => venta.estado === "PEDIDO FINALIZADO")
          .map((venta, i) => (
            <tr key={i} className="border-t">
              <td className="py-2 px-4 border">{venta.id}</td>
              <td className="py-2 px-4 border">{venta.cliente?.nombre} {venta.cliente?.apellido}</td>
              <td className="py-2 px-4 border">{venta.cliente?.telefono}</td>
              <td className="py-2 px-4 border">{venta.cliente?.observaciones}</td>
              <td className="py-2 px-4 border">${venta.total}</td>
              <td className="py-2 px-4 border capitalize">{venta.metodoPago}</td>
              <td className="py-2 px-4 border">{venta.estado}</td>
              <td className="py-2 px-4 border">{new Date(venta.fecha).toLocaleDateString()}</td>
            </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

{/* Resumen por día */}
<div>
  <h3 className="text-lg font-bold mb-4">Resumen: Total Vendido por Día</h3>
  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-300 text-sm text-center">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 border">Fecha</th>
          <th className="px-4 py-2 border">Total Ventas ($)</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(
          ventas
            .filter((venta) => venta.estado === "PEDIDO FINALIZADO")
            .reduce((acc, venta) => {
              const fecha = new Date(venta.fecha).toLocaleDateString();
              acc[fecha] = (acc[fecha] || 0) + venta.total;
              return acc;
            }, {})
        ).map(([fecha, total], i) => (
          <tr key={i}>
            <td className="px-4 py-2 border">{fecha}</td>
            <td className="px-4 py-2 border">${total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

</div>

    </div>
  )
}