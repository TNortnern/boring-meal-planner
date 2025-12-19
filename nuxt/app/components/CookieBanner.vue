<script setup lang="ts">
const { needsConsent, acceptCookies: accept, declineCookies: decline } = useCookieConsent()
const isClient = ref(false)

onMounted(() => {
  isClient.value = true
})

function acceptCookies() {
  accept()
}

function declineCookies() {
  decline()
}

const showBanner = computed(() => isClient.value && needsConsent.value)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div
        v-if="showBanner"
        class="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
      >
        <div class="mx-auto max-w-4xl">
          <div class="rounded-xl border border-default bg-elevated shadow-lg backdrop-blur-sm">
            <div class="p-6 space-y-4">
              <!-- Header -->
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="text-base font-semibold mb-2">
                    Cookie Preferences
                  </h3>
                  <p class="text-sm text-muted leading-relaxed">
                    We use essential cookies to keep this app running smoothly and remember your preferences.
                    No tracking, no analytics, no third-party nonsense. Just the boring stuff that makes things work.
                  </p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <NuxtLink
                  to="/settings/preferences"
                  class="text-sm text-muted hover:text-default transition-colors inline-flex items-center gap-1"
                >
                  <UIcon name="i-lucide-settings" class="size-4" />
                  <span>Privacy Settings</span>
                </NuxtLink>

                <div class="flex gap-3">
                  <UButton
                    variant="ghost"
                    color="neutral"
                    @click="declineCookies"
                  >
                    Decline
                  </UButton>
                  <UButton
                    color="primary"
                    @click="acceptCookies"
                  >
                    Accept
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
