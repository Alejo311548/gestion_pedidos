'use client'
import { useState } from 'react'
import MaestroSelector from './components/MaestroSelector'
import TablaMovimientos from './components/TablaMovimientos'
import ModalAgregarMovimiento from './components/ModalAgregarMovimiento'

type Maestro = {
  id: number
  nombre: string
  saldo: number
}

export default function TransaccionesPage() {
  const [maestroSeleccionado, setMaestroSeleccionado] = useState<Maestro | null>(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [refrescar, setRefrescar] = useState(false)

  const actualizarSaldo = async (id: number) => {
    const res = await fetch(`/api/maestros/${id}`)
    if (res.ok) {
      const json = await res.json()
      setMaestroSeleccionado(json)
    }
  }

  const handleAgregado = () => {
    if (maestroSeleccionado) {
      actualizarSaldo(maestroSeleccionado.id)
      setRefrescar((r) => !r)
    }
    setMostrarModal(false)
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Gestión de Transacciones</h1>

      <div className="mb-6">
        <MaestroSelector onSeleccionar={setMaestroSeleccionado} />
      </div>

      {maestroSeleccionado && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">
              Maestro: <span className="text-blue-600 font-medium">{maestroSeleccionado.nombre}</span> <br />
              <span className="text-sm text-gray-600">Saldo actual: </span>
              <span className="text-green-600 font-bold">${maestroSeleccionado.saldo}</span>
            </h2>

            <button
              onClick={() => setMostrarModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-sm transition"
            >
              + Agregar Movimiento
            </button>
          </div>

          <div className="bg-white border rounded-lg shadow-sm p-4">
            <TablaMovimientos maestroId={maestroSeleccionado.id} refrescar={refrescar} />
          </div>

          <ModalAgregarMovimiento
            visible={mostrarModal}
            maestroId={maestroSeleccionado.id}
            onClose={() => setMostrarModal(false)}
            onAgregado={handleAgregado}
          />
        </>
      )}
    </div>
  )
}
