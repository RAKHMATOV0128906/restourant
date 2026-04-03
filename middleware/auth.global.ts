export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  const isAuthPage = to.path === '/' || to.path === '/register'

  if (!isAuthPage && !isAuthenticated.value) {
    return navigateTo('/')
  }

  if (isAuthPage && isAuthenticated.value) {
    return navigateTo('/restaurants')
  }
})
