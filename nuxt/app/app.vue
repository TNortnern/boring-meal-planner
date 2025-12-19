<script setup lang="ts">
const colorMode = useColorMode()
const appConfig = useAppConfig()

const color = computed(() => colorMode.value === 'dark' ? '#1c1917' : '#fafaf9')

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
  </UApp>
</template>
