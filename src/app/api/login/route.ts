import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, full_name, role, password_hash')
    .ilike('email', email)
    .single()

  if (error || !user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  
  const { password_hash, ...userWithoutPassword } = user
  return NextResponse.json({ user: userWithoutPassword })
}
