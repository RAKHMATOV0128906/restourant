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

  const login = (email: string, name = '') => {
    userEmail.value = email
    userName.value = name || email.split('@')[0] || 'User'
    emailCookie.value = userEmail.value
    nameCookie.value = userName.value
  }

  const register = (name: string, email: string) => {
    userName.value = name
    userEmail.value = email
    emailCookie.value = userEmail.value
    nameCookie.value = userName.value
  }

  const logout = () => {
    userEmail.value = ''
    userName.value = ''
    emailCookie.value = ''
    nameCookie.value = ''
  }

  return {
    userEmail,
    userName,
    isAuthenticated,
    login,
    register,
    logout,
  }
}
