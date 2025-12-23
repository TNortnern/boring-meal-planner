<script setup lang="ts">
const colorMode = useColorMode()
const appConfig = useAppConfig()

// Use static useHead for SSR to avoid hydration mismatch
// Theme-color is updated on client via watch below
useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: '#fafaf9' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

// Update theme-color on client only after hydration
onMounted(() => {
  const updateThemeColor = () => {
    const color = colorMode.value === 'dark' ? '#1c1917' : '#fafaf9'
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', color)
  }

  // Update immediately and watch for changes
  updateThemeColor()
  watch(() => colorMode.value, updateThemeColor)
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
