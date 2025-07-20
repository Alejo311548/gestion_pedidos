import Sidebar from '../components/Sidebar'
import { ReactNode } from 'react'
import '../globals.css'

export default function PrivadoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />

      <main className="ml-64 w-full p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
