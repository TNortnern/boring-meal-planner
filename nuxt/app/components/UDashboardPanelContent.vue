<script setup lang="ts">
// Simple wrapper component to replace UDashboardPanelContent
// Provides scrollable container with padding for dashboard panels
</script>

<template>
  <div class="flex-1 flex flex-col overflow-y-auto p-4">
    <slot />
  </div>
</template>
