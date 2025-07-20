'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserFromLocalStorage } from '../../utils/auth'

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = getUserFromLocalStorage()
    if (!userData) {
      router.push('/login')
    } else {
      setUser(userData)
    }
  }, [])

  if (!user) return null

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-white rounded-xl shadow p-8">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-4">Panel Principal</h1>
      <p className="text-gray-700 text-lg">
        Bienvenido, <span className="font-semibold">{user.full_name}</span>
      </p>
      <p className="text-sm text-gray-500 mt-1">Rol: <span className="uppercase font-medium">{user.role}</span></p>
    </div>
  )
}
