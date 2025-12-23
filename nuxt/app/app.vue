<script setup lang="ts">
const colorMode = useColorMode()
const appConfig = useAppConfig()

// Track client-side to avoid hydration mismatch with colorMode
const isClient = ref(false)
onMounted(() => {
  isClient.value = true
})

// Use isClient guard to avoid SSR/client hydration mismatch
const color = computed(() => {
  if (!isClient.value) return '#fafaf9' // Default to light during SSR
  return colorMode.value === 'dark' ? '#1c1917' : '#fafaf9'
})

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = appConfig.app?.name || 'BORING Meal Planner'
const description = 'Simple, effective nutrition planning. No fasting, no cheat meals, no guessing. Just boring consistency that works.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <CookieBanner />
  </UApp>
</template>
