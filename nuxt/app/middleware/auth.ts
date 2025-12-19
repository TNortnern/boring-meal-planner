export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, init } = useAuth()

  // Initialize auth on first load
  await init()

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register']

  if (publicRoutes.includes(to.path)) {
    // If already authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthenticated.value && (to.path === '/login' || to.path === '/register')) {
      return navigateTo('/dashboard')
    }
    return
  }

  // Protected routes require authentication
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
