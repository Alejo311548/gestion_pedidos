
'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getUserFromLocalStorage } from '../utils/auth'

export default function Sidebar() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = getUserFromLocalStorage()
    setUser(userData)
  }, [])

  if (!user) return null

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md p-4 fixed left-0 top-0">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Bienvenido</h2>
        <p className="text-sm text-gray-600">{user.full_name}</p>
        <p className="text-xs text-gray-400">{user.role}</p>
      </div>

      <nav className="flex flex-col gap-4">
        <Link href="/transacciones" className="hover:underline">Transacciones</Link>
        <Link href="/maestros" className="hover:underline">Maestros</Link>
        {user.role === 'ADMIN' && (
          <Link href="/usuarios" className="hover:underline">Usuarios</Link>
        )}
        <button
  onClick={() => {
    localStorage.clear()
    
    window.location.href = '/'
  }}
  className="w-full mt-auto bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-4 py-2 rounded-lg text-left"
>
  Cerrar sesión
</button>

      </nav>
    </aside>
  )
}
