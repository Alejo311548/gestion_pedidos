'use client'
import { useEffect, useState } from 'react'

type Maestro = {
  id: number
  nombre: string
  saldo: number
}

type Props = {
  onSeleccionar: (maestro: Maestro) => void
}

export default function MaestroSelector({ onSeleccionar }: Props) {
  const [maestros, setMaestros] = useState<Maestro[]>([])
  const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const fetchMaestros = async () => {
      const res = await fetch('/api/maestros')
      if (res.ok) {
        const data = await res.json()
        setMaestros(data)
      }
      setCargando(false)
    }

    fetchMaestros()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value)
    setSeleccionadoId(id)
    const maestro = maestros.find((m) => m.id === id)
    if (maestro) onSeleccionar(maestro)
  }

  return (
    <div className="space-y-2">
      <label className="block font-medium">Selecciona un Maestro</label>
      {cargando ? (
        <p className="text-gray-500">Cargando maestros...</p>
      ) : (
        <select
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={seleccionadoId ?? ''}
          onChange={handleChange}
        >
          <option value="">-- Seleccionar --</option>
          {maestros.map((maestro) => (
            <option key={maestro.id} value={maestro.id}>
              {maestro.nombre}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
