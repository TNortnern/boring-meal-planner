<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const { register, isLoading, isAuthenticated } = useAuth()
const router = useRouter()
const toast = useToast()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

// Redirect if already authenticated
watch(isAuthenticated, (authenticated) => {
  if (authenticated) {
    router.push('/onboarding')
  }
}, { immediate: true })

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    toast.add({
      title: 'Error',
      description: 'Please fill in all required fields',
      color: 'error'
    })
    return
  }

  if (password.value !== confirmPassword.value) {
    toast.add({
      title: 'Error',
      description: 'Passwords do not match',
      color: 'error'
    })
    return
  }

  if (password.value.length < 8) {
    toast.add({
      title: 'Error',
      description: 'Password must be at least 8 characters',
      color: 'error'
    })
    return
  }

  const result = await register({
    email: email.value,
    password: password.value,
    name: name.value || undefined
  })

  if (result.success) {
    toast.add({
      title: 'Account created!',
      description: 'Welcome to BORING Meal Planner',
      color: 'success'
    })
    router.push('/onboarding')
  } else {
    toast.add({
      title: 'Registration failed',
      description: result.error || 'Could not create account',
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
          Create your account
        </p>
      </div>

      <UCard>
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <UFormField label="Name (optional)">
            <UInput
              v-model="name"
              type="text"
              placeholder="Your name"
              class="w-full"
            />
          </UFormField>

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
              placeholder="At least 8 characters"
              class="w-full"
              required
            />
          </UFormField>

          <UFormField label="Confirm Password">
            <UInput
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              class="w-full"
              required
            />
          </UFormField>

          <UButton
            type="submit"
            class="w-full"
            :loading="isLoading"
          >
            Create Account
          </UButton>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-muted">
            Already have an account?
            <NuxtLink to="/login" class="text-primary hover:underline">
              Sign in
            </NuxtLink>
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
