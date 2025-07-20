'use client'

import { useState } from 'react'

export default function AgregarMaestroModal({
  userId,
  onClose
}: {
  userId: string
  onClose: () => void
}) {
  const [nombre, setNombre] = useState('')
  const [saldo, setSaldo] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCrear = async () => {
    setLoading(true)
    const res = await fetch('/api/maestros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, saldo_inicial: saldo, creado_por: userId })
    })
    const json = await res.json()
    setLoading(false)

    if (res.ok) {
      onClose()
    } else {
      setError(json.error || 'Error al crear maestro')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Agregar Maestro</h2>
        <input
          className="w-full p-2 border mb-3"
          placeholder="Nombre del Maestro"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          className="w-full p-2 border mb-3"
          type="number"
          placeholder="Saldo inicial"
          value={saldo}
          onChange={(e) => setSaldo(parseInt(e.target.value))}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancelar
          </button>
          <button
            onClick={handleCrear}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  )
}
