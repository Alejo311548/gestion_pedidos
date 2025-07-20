'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserFromLocalStorage } from '../../utils/auth'
import AgregarMaestroModal from '../../components/AgregarMaestroModal'

export default function MaestrosPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [maestros, setMaestros] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const u = getUserFromLocalStorage()
    if (!u) {
      router.push('/login')
    } else {
      setUser(u)
      fetchMaestros()
    }
  }, [])

  const fetchMaestros = async () => {
    setLoading(true)
    const res = await fetch('/api/maestros')
    const json = await res.json()
    setMaestros(json)
    setLoading(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Maestros</h1>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Agregar Maestro
          </button>
        )}
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Nombre</th>
              <th className="p-2">Saldo Inicial</th>
              <th className="p-2">Creado por</th>
            </tr>
          </thead>
          <tbody>
            {maestros.map((m) => (
              <tr key={m.id} className="text-center border-t">
                <td className="p-2">{m.nombre}</td>
                <td className="p-2">{m.saldo_inicial}</td>
                <td className="p-2">{m.creado_por_email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <AgregarMaestroModal
          userId={user.id}
          onClose={() => {
            setModalOpen(false)
            fetchMaestros()
          }}
        />
      )}
    </div>
  )
}
