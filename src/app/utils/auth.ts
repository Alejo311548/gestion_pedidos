
export function getUserFromLocalStorage() {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}
