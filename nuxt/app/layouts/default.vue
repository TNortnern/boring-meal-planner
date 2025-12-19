<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const _route = useRoute()
const _appConfig = useAppConfig()

const open = ref(false)

const links = [[{
  label: 'Dashboard',
  icon: 'i-lucide-layout-dashboard',
  to: '/dashboard',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Meal Plan',
  icon: 'i-lucide-calendar',
  to: '/meals',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Recipes',
  icon: 'i-lucide-book-open',
  to: '/recipes',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Exercises',
  icon: 'i-lucide-dumbbell',
  to: '/exercises',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Workouts',
  icon: 'i-lucide-activity',
  to: '/workouts',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Progress',
  icon: 'i-lucide-trending-up',
  to: '/progress',
  onSelect: () => {
    open.value = false
  }
}], [{
  label: 'Settings',
  icon: 'i-lucide-settings',
  to: '/settings',
  onSelect: () => {
    open.value = false
  }
}]] satisfies NavigationMenuItem[][]

const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: links.flat()
}])
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
