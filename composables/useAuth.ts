export const useAuth = () => {
  const emailCookie = useCookie<string>('bp-user-email', {
    default: () => '',
    sameSite: 'lax',
    path: '/',
  })
  const nameCookie = useCookie<string>('bp-user-name', {
    default: () => '',
    sameSite: 'lax',
    path: '/',
  })

  const userEmail = useState<string>('user-email', () => emailCookie.value || '')
  const userName = useState<string>('user-name', () => nameCookie.value || '')

  const isAuthenticated = computed(() => Boolean(userEmail.value))

  const syncStorage = () => {
    if (!import.meta.client) {
      return
    }

    if (userEmail.value) {
      localStorage.setItem('bp-user-email', userEmail.value)
      localStorage.setItem('bp-user-name', userName.value)
    } else {
      localStorage.removeItem('bp-user-email')
      localStorage.removeItem('bp-user-name')
    }
  }

  const restoreStorage = () => {
    if (!import.meta.client || userEmail.value) {
      return
    }

    const storedEmail = localStorage.getItem('bp-user-email') || ''
    const storedName = localStorage.getItem('bp-user-name') || ''

    if (storedEmail) {
      userEmail.value = storedEmail
      userName.value = storedName
      emailCookie.value = storedEmail
      nameCookie.value = storedName
    }
  }

  const login = (email: string, name = '') => {
    userEmail.value = email
    userName.value = name || email.split('@')[0] || 'User'
    emailCookie.value = userEmail.value
    nameCookie.value = userName.value
    syncStorage()
  }

  const register = (name: string, email: string) => {
    userName.value = name
    userEmail.value = email
    emailCookie.value = userEmail.value
    nameCookie.value = userName.value
    syncStorage()
  }

  const logout = () => {
    userEmail.value = ''
    userName.value = ''
    emailCookie.value = ''
    nameCookie.value = ''
    syncStorage()
  }

  restoreStorage()

  return {
    userEmail,
    userName,
    isAuthenticated,
    login,
    register,
    logout,
  }
}
