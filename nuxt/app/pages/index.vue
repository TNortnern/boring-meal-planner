<script setup lang="ts">
// Redirect to onboarding or dashboard based on user state
definePageMeta({
  layout: 'onboarding'
})

// TODO: Check if user has completed onboarding from backend
const hasCompletedOnboarding = ref(false)

// Use immediate redirect to avoid SSR issues
if (import.meta.client) {
  watchEffect(() => {
    if (hasCompletedOnboarding.value) {
      navigateTo('/dashboard', { replace: true })
    } else {
      navigateTo('/onboarding', { replace: true })
    }
  })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      <p class="mt-2 text-sm text-muted">
        Loading...
      </p>
    </div>
  </div>
</template>
