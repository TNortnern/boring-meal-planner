<script setup lang="ts">
const { state } = useOnboarding()
const { user } = useAuth()

// Pre-populate if user is logged in
if (user.value?.name && !state.value.name) {
  state.value.name = user.value.name
}
if (user.value?.email && !state.value.email) {
  state.value.email = user.value.email
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-muted text-sm">
      Let's get to know you a bit better. This helps us personalize your experience.
    </div>

    <!-- Name -->
    <UFormField label="Your name" description="What should we call you?">
      <UInput
        v-model="state.name"
        type="text"
        placeholder="John Doe"
        class="w-full"
      />
    </UFormField>

    <!-- Email -->
    <UFormField label="Email address" description="We'll use this for your account">
      <UInput
        v-model="state.email"
        type="email"
        placeholder="you@example.com"
        class="w-full"
      />
    </UFormField>
  </div>
</template>
