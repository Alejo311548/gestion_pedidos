import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const maestroId = parseInt(searchParams.get('maestroId') || '0')

  if (!maestroId) {
    return NextResponse.json({ error: 'ID de maestro no válido' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('movimientos')
    .select('id, tipo, monto, descripcion, creado_en')
    .eq('maestro_id', maestroId)
    .order('creado_en', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { maestro_id, tipo, monto, descripcion } = body

  if (!maestro_id || !tipo || !monto || !descripcion) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }

  // ✅ 1. Obtener maestro actual
  const { data: maestro, error: maestroError } = await supabase
    .from('maestros')
    .select('saldo_inicial')
    .eq('id', maestro_id)
    .single()

  if (maestroError || !maestro) {
    return NextResponse.json({ error: 'Maestro no encontrado' }, { status: 404 })
  }

  const saldoActual = maestro.saldo_inicial as number
  const nuevoSaldo =
    tipo === 'entrada' ? saldoActual + monto : saldoActual - monto

  // ✅ 2. Insertar movimiento
  const { error: insertError } = await supabase.from('movimientos').insert([
    {
      maestro_id,
      tipo,
      monto,
      descripcion,
    },
  ])

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // ✅ 3. Actualizar saldo
  const { error: updateError } = await supabase
    .from('maestros')
    .update({ saldo_inicial: nuevoSaldo })
    .eq('id', maestro_id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Movimiento registrado' })
}
