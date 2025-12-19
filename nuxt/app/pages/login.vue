<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const { login, isLoading, error: _authError, isAuthenticated } = useAuth()
const router = useRouter()
const toast = useToast()

const email = ref('')
const password = ref('')

// Redirect if already authenticated
watch(isAuthenticated, (authenticated) => {
  if (authenticated) {
    router.push('/dashboard')
  }
}, { immediate: true })

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    toast.add({
      title: 'Error',
      description: 'Please enter email and password',
      color: 'error'
    })
    return
  }

  const result = await login(email.value, password.value)

  if (result.success) {
    toast.add({
      title: 'Welcome back!',
      description: 'You have been logged in successfully',
      color: 'success'
    })
    router.push('/dashboard')
  } else {
    toast.add({
      title: 'Login failed',
      description: result.error || 'Invalid credentials',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-default px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold">
          BORING Meal Planner
        </h1>
        <p class="text-muted mt-2">
          Sign in to your account
        </p>
      </div>

      <UCard>
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <UFormField label="Email">
            <UInput
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="w-full"
              required
            />
          </UFormField>

          <UFormField label="Password">
            <UInput
              v-model="password"
              type="password"
              placeholder="Your password"
              class="w-full"
              required
            />
          </UFormField>

          <UButton
            type="submit"
            class="w-full"
            :loading="isLoading"
          >
            Sign In
          </UButton>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-muted">
            Don't have an account?
            <NuxtLink to="/register" class="text-primary hover:underline">
              Sign up
            </NuxtLink>
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
