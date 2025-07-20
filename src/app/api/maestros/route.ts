import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase
    .from('maestros')
    .select('id, nombre, saldo_inicial, creado_por, creado_en')
    .order('creado_en', { ascending: false })

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Error desconocido' }, { status: 500 })
  }

  const { data: usuarios, error: errorUsuarios } = await supabase
    .from('users')
    .select('id, email')

  if (errorUsuarios || !usuarios) {
    return NextResponse.json({ error: 'Error al cargar usuarios' }, { status: 500 })
  }

  const maestrosConEmail = data.map((m) => ({
    ...m,
    creado_por_email: usuarios.find((u) => u.id === m.creado_por)?.email || 'Desconocido'
  }))

  return NextResponse.json(maestrosConEmail)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, saldo_inicial, creado_por } = body

    if (!nombre || saldo_inicial == null || !creado_por) {
      return NextResponse.json({ error: 'Campos faltantes' }, { status: 400 })
    }

    const { error } = await supabase.from('maestros').insert([
      { nombre, saldo_inicial, creado_por }
    ])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Maestro creado' })
  } catch (e) {
    return NextResponse.json({ error: 'Error inesperado en el servidor' }, { status: 500 })
  }
}
