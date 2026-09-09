export function tokenExpiryDelay(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return Math.max(0, Number(payload.exp) * 1000 - Date.now())
  } catch {
    return 0
  }
}

export function clearUserSession() {
  localStorage.removeItem('chalakgo_user_token')
  localStorage.removeItem('chalakgo_user')
  sessionStorage.removeItem('chalakgo_user_token')
}