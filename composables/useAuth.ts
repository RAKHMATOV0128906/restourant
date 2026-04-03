export const useAuth = () => {
  const userEmail = useState<string>('user-email', () => '')
  const userName = useState<string>('user-name', () => '')

  const isAuthenticated = computed(() => Boolean(userEmail.value))

  const login = (email: string, name = '') => {
    userEmail.value = email
    userName.value = name || email.split('@')[0] || 'User'
  }

  const register = (name: string, email: string) => {
    userName.value = name
    userEmail.value = email
  }

  const logout = () => {
    userEmail.value = ''
    userName.value = ''
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
