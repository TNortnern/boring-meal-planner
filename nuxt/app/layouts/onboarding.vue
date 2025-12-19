<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <div class="min-h-screen bg-default flex flex-col">
    <!-- Simple header -->
    <header class="border-b border-default px-6 py-4">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-utensils" class="w-6 h-6 text-primary" />
          <span class="font-semibold text-lg">{{ appConfig.app?.name }}</span>
        </div>
        <UColorModeButton />
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 px-6 py-8">
      <div class="max-w-2xl mx-auto">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-default px-6 py-4">
      <div class="max-w-2xl mx-auto text-center text-sm text-muted">
        No fasting. No cheat meals. No guessing.
      </div>
    </footer>
  </div>
</template>
