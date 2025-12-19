export default defineNuxtPlugin(async () => {
  const { init } = useAuth()

  // Initialize auth state on app load
  await init()
})
