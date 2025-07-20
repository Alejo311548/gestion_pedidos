'use client'

import { useEffect, useState } from 'react'
import ModalCrearUsuario from './components/ModalCrearUsuario'

type Usuario = {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [mostrarModal, setMostrarModal] = useState(false)

  const fetchUsuarios = async () => {
    const res = await fetch('/api/usuarios')
    const data = await res.json()
    setUsuarios(data)
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <button
          onClick={() => setMostrarModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear Usuario
        </button>
      </div>

      <table className="w-full table-auto border mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Nombre completo</th>
            <th className="p-2 border">Rol</th>
            <th className="p-2 border">Creado</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="text-center border-t">
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.full_name}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">{new Date(u.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalCrearUsuario
        visible={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onUsuarioCreado={fetchUsuarios}
      />
    </div>
  )
}
