'use client'

import { useState } from 'react'
import VariedadesCRUD from '../components/VariedadesCRUD'
import StockCRUD from '../components/StockCRUD'
import UsuariosCRUD from '../components/UsuariosCRUD'
import VentasCRUD from '../components/VentasCRUD'


const tabs = [
  { id: 'variedades', label: 'Variedades' },
  { id: 'stock', label: 'Stock' },
  { id: 'ventas', label: 'Ventas' },
  { id: 'usuarios', label: 'Usuarios' },
]

export default function PanelAdmin() {
  const [activeTab, setActiveTab] = useState('variedades')

  const renderTab = () => {
    switch (activeTab) {
      case 'variedades': return <VariedadesCRUD />
      case 'stock': return <StockCRUD />
      case 'ventas': return <VentasCRUD />
      case 'usuarios': return <UsuariosCRUD />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-orange-100 p-6">
      <div className="w-full mx-auto bg-white rounded-2xl shadow-lg p-4">
        <h1 className="text-3xl font-bold mb-6 text-orange-600 text-center">Panel Administrativo</h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-orange-200 text-orange-800 hover:bg-orange-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sección activa */}
        <div className="bg-orange-50 rounded-xl w-full p-4">
          {renderTab()}
        </div>
      </div>
    </div>
  )
}
