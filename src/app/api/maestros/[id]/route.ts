import { supabase } from '@/lib/supabaseClient'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    const { data: maestro, error: maestroError } = await supabase
      .from('maestros')
      .select('id, nombre, saldo_inicial, creado_por')
      .eq('id', id)
      .single()

    if (maestroError || !maestro) {
      return NextResponse.json(
        { error: 'No se encontró el maestro' }, 
        { status: 404 }
      )
    }

    const { data: movimientos, error: movimientosError } = await supabase
      .from('movimientos')
      .select('monto')
      .eq('maestro_id', id)

    if (movimientosError) {
      return NextResponse.json(
        { error: 'Error obteniendo movimientos' }, 
        { status: 500 }
      )
    }

    const sumaMovimientos = movimientos?.reduce((sum, m) => sum + m.monto, 0) ?? 0
    const saldo = maestro.saldo_inicial + sumaMovimientos

    return NextResponse.json({
      ...maestro,
      saldo,
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}