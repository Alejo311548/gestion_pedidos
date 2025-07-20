import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas públicas (que no requieren autenticación)
const PUBLIC_PATHS = ['/', '/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir rutas estáticas (css, js, img, etc.)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  // Permitir si es una ruta pública
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  // Validar si hay sesión en localStorage o cookies
  const session = request.cookies.get('session')

  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|api).*)'],
}
