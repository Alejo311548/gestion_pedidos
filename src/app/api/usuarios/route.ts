// src/app/api/usuarios/route.ts (GET)
import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET() {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, role, created_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

// src/app/api/usuarios/route.ts (POST)

export async function POST(req: Request) {
  const body = await req.json()
  const { email, full_name, password, role } = body

  if (!email || !full_name || !password || !role) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const { error } = await supabase.from('users').insert([
    { email, full_name, password_hash: hashedPassword, role }
  ])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ message: 'Usuario creado' })
}

