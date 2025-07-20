
export function getUsuarioDesdeLocalStorage() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('usuario')
    return user ? JSON.parse(user) : null
  }
  return null
}
