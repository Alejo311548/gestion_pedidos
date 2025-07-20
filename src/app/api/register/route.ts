import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { email, password, full_name } = await req.json()

  if (!email || !password || !full_name) {
    return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 })
  }

  try {
    const password_hash = await bcrypt.hash(password, 10)

    const { error } = await supabase.from('users').insert({
      email,
      full_name,
      password_hash,
      role: 'USER', 
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Usuario registrado correctamente' })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
