<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const links = [[{
  label: 'Profile',
  icon: 'i-lucide-user',
  to: '/settings',
  exact: true
}, {
  label: 'Macros',
  icon: 'i-lucide-calculator',
  to: '/settings/macros'
}, {
  label: 'Preferences',
  icon: 'i-lucide-sliders',
  to: '/settings/preferences'
}, {
  label: 'Account',
  icon: 'i-lucide-shield',
  to: '/settings/account'
}]] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardPanel id="settings" grow>
    <UDashboardNavbar title="Settings">
      <template #leading>
        <UDashboardSidebarToggle />
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UDashboardNavbar>

    <UDashboardToolbar>
      <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
    </UDashboardToolbar>

    <UDashboardPanelContent class="px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <NuxtPage />
      </div>
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>
