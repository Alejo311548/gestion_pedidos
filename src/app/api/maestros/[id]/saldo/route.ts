import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const parsedId = parseInt(id)

  // Obtener maestro y su saldo_inicial
  const { data: maestro, error: errorMaestro } = await supabase
    .from('maestros')
    .select('saldo_inicial')
    .eq('id', parsedId)
    .single()

  if (errorMaestro || !maestro) {
    return NextResponse.json({ error: 'Maestro no encontrado' }, { status: 404 })
  }

  // Obtener movimientos asociados
  const { data: movimientos, error: errorMov } = await supabase
    .from('movimientos')
    .select('tipo, valor')
    .eq('maestro_id', parsedId)

  if (errorMov || !movimientos) {
    return NextResponse.json({ error: 'No se pudieron obtener los movimientos' }, { status: 500 })
  }

  // Calcular saldo
  let saldo = maestro.saldo_inicial
  for (const mov of movimientos) {
    if (mov.tipo === 'ingreso') saldo += mov.valor
    if (mov.tipo === 'egreso') saldo -= mov.valor
  }

  return NextResponse.json({ saldo })
}
