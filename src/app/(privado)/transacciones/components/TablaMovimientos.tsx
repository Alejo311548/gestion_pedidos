'use client'
import { useEffect, useState } from 'react'

type Movimiento = {
  id: number
  tipo: 'entrada' | 'salida'
  monto: number
  descripcion: string
  creado_en: string
}

type Props = {
  maestroId: number
  refrescar: boolean
}

export default function TablaMovimientos({ maestroId, refrescar }: Props) {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const fetchMovimientos = async () => {
      setCargando(true)
      const res = await fetch(`/api/movimientos?maestroId=${maestroId}`)
      if (res.ok) {
        const data = await res.json()
        setMovimientos(data)
      }
      setCargando(false)
    }

    fetchMovimientos()
  }, [maestroId, refrescar])

  if (cargando) return <p>Cargando movimientos...</p>

  if (movimientos.length === 0) {
    return <p className="text-gray-500">No hay movimientos para este maestro.</p>
  }

  return (
    <table className="w-full border mt-4">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2">Tipo</th>
          <th className="p-2">Monto</th>
          <th className="p-2">Descripción</th>
          <th className="p-2">Fecha</th>
        </tr>
      </thead>
      <tbody>
        {movimientos.map((mov) => (
          <tr key={mov.id} className="border-t">
            <td className="p-2">{mov.tipo}</td>
            <td className="p-2">{mov.tipo === 'salida' ? '-' : ''}${mov.monto.toFixed(2)}</td>
            <td className="p-2">{mov.descripcion}</td>
            <td className="p-2">{new Date(mov.creado_en).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
