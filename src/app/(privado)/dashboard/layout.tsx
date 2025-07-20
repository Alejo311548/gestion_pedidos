
import Sidebar from '../../components/Sidebar'
import '@/app/globals.css'
import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-8 w-full bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  )
}
