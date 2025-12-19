<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()

const _appConfig = useAppConfig()
</script>

<template>
  <NuxtLink
    to="/dashboard"
    class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-elevated transition-colors"
  >
    <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
      <UIcon name="i-lucide-utensils" class="w-5 h-5 text-primary" />
    </div>
    <span v-if="!collapsed" class="font-semibold text-sm">
      BORING
    </span>
  </NuxtLink>
</template>
