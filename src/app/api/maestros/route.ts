import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'


export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  const { data, error } = await supabase
    .from('maestros')
    .select('id, nombre, saldo_inicial')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    id: data.id,
    nombre: data.nombre,
    saldo: data.saldo_inicial,
  })
}
