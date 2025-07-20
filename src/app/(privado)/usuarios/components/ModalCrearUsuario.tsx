'use client'
import { useState } from 'react'

type Props = {
  visible: boolean
  onClose: () => void
  onUsuarioCreado: () => void
}

export default function ModalCrearUsuario({ visible, onClose, onUsuarioCreado }: Props) {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'ADMIN' | 'USER'>('USER')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleCrear = async () => {
    if (!email || !fullName || !password) {
      return setMensaje('Todos los campos son obligatorios')
    }

    setCargando(true)
    setMensaje('')

    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, full_name: fullName, password, role }),
    })

    const json = await res.json()
    if (res.ok) {
      onUsuarioCreado()
      onClose()
      setEmail('')
      setFullName('')
      setPassword('')
      setRole('USER')
    } else {
      setMensaje(json.error || 'Error al crear')
    }

    setCargando(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
        <h2 className="text-lg font-bold">Nuevo Usuario</h2>

        <input
          placeholder="Email"
          className="w-full border rounded p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Nombre completo"
          className="w-full border rounded p-2"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          placeholder="Contraseña"
          type="password"
          className="w-full border rounded p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="w-full border rounded p-2"
          value={role}
          onChange={(e) => setRole(e.target.value as 'ADMIN' | 'USER')}
        >
          <option value="USER">Usuario</option>
          <option value="ADMIN">Administrador</option>
        </select>

        {mensaje && <p className="text-sm text-red-600">{mensaje}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded border text-gray-700">
            Cancelar
          </button>
          <button
            onClick={handleCrear}
            disabled={cargando}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {cargando ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  )
}
