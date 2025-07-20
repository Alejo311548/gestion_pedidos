'use client'
import { useState } from 'react'

type Props = {
  visible: boolean
  onClose: () => void
  maestroId: number
  onAgregado: () => void
}

export default function ModalAgregarMovimiento({ visible, onClose, maestroId, onAgregado }: Props) {
  const [tipo, setTipo] = useState<'entrada' | 'salida'>('entrada')
  const [monto, setMonto] = useState<number>(0)
  const [descripcion, setDescripcion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const handleGuardar = async () => {
    if (!monto || monto <= 0) return setMensaje('El monto debe ser mayor a cero')
    if (!descripcion.trim()) return setMensaje('Agrega una descripción')

    setCargando(true)
    setMensaje('')

    const res = await fetch('/api/movimientos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    maestro_id: maestroId,
    tipo: tipo.toUpperCase(), 
    monto,
    descripcion,
  }),
})


    const json = await res.json()
    if (res.ok) {
      setMonto(0)
      setDescripcion('')
      setMensaje('Movimiento registrado exitosamente')
      onAgregado()
      onClose()
    } else {
      setMensaje(json.error || 'Error al guardar')
    }

    setCargando(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
        <h2 className="text-lg font-bold">Nuevo Movimiento</h2>

        <div>
          <label className="block font-medium mb-1">Tipo:</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as 'entrada' | 'salida')}
            className="w-full border rounded p-2"
          >
            <option value="entrada">ENTRADA</option>
            <option value="salida">SALIDA</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Monto:</label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(parseFloat(e.target.value))}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Descripción:</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {mensaje && <p className="text-sm text-red-600">{mensaje}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded border text-gray-700">
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={cargando}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {cargando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
