<script setup lang="ts">
const { user, updateProfile } = useAuth()
const toast = useToast()
const colorMode = useColorMode()

// Parse comma-separated string to array
const parseCommaList = (str: string | undefined): string[] => {
  if (!str) return []
  return str.split(',').map(s => s.trim()).filter(Boolean)
}

// Track client-side to avoid hydration mismatch with colorMode
const isClient = ref(false)

const preferences = reactive({
  boringMode: user.value?.boringMode ?? true,
  mealsPerDay: user.value?.preferences?.mealsPerDay ?? 3,
  cookEverything: user.value?.preferences?.cookEverything ?? true,
  repeatMeals: user.value?.preferences?.repeatMeals ?? true,
  cardioPreference: user.value?.preferences?.cardioPreference ?? 'incline_walk',
  darkMode: false, // Set in onMounted to avoid hydration mismatch
  notifications: true,
  weeklyReminders: true
})

// Set darkMode on client only to avoid hydration mismatch
onMounted(() => {
  isClient.value = true
  preferences.darkMode = colorMode.value === 'dark'
})

// Watch for dark mode changes and sync with colorMode (only on client)
watch(() => preferences.darkMode, (newValue) => {
  if (isClient.value) {
    colorMode.preference = newValue ? 'dark' : 'light'
  }
})

// Watch for external colorMode changes and sync with preferences (only on client)
watch(() => colorMode.value, (newValue) => {
  if (isClient.value) {
    preferences.darkMode = newValue === 'dark'
  }
})

const allergies = ref<string[]>(parseCommaList(user.value?.dietaryRestrictions?.allergies))
const dietaryPattern = ref<string>(user.value?.dietaryRestrictions?.dietaryPattern || 'none')

// Update when user data loads
watch(user, (newUser) => {
  if (newUser) {
    preferences.boringMode = newUser.boringMode ?? true
    preferences.mealsPerDay = newUser.preferences?.mealsPerDay ?? 3
    preferences.cookEverything = newUser.preferences?.cookEverything ?? true
    preferences.repeatMeals = newUser.preferences?.repeatMeals ?? true
    preferences.cardioPreference = newUser.preferences?.cardioPreference ?? 'incline_walk'
    allergies.value = parseCommaList(newUser.dietaryRestrictions?.allergies)
    dietaryPattern.value = newUser.dietaryRestrictions?.dietaryPattern || 'none'
  }
}, { immediate: true })

const allergyOptions = [
  { value: 'dairy', label: 'Dairy' },
  { value: 'gluten', label: 'Gluten' },
  { value: 'nuts', label: 'Nuts' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'soy', label: 'Soy' },
  { value: 'shellfish', label: 'Shellfish' }
]

const dietaryPatternOptions = [
  { value: 'none', label: 'None' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
  { value: 'pescatarian', label: 'Pescatarian' }
]

function toggleAllergy(allergy: string) {
  const index = allergies.value.indexOf(allergy)
  if (index === -1) {
    allergies.value.push(allergy)
  } else {
    allergies.value.splice(index, 1)
  }
}

function selectDietaryPattern(pattern: string) {
  dietaryPattern.value = dietaryPattern.value === pattern ? 'none' : pattern
}

async function saveSettings() {
  const result = await updateProfile({
    boringMode: preferences.boringMode,
    preferences: {
      mealsPerDay: preferences.mealsPerDay,
      cookEverything: preferences.cookEverything,
      repeatMeals: preferences.repeatMeals,
      cardioPreference: preferences.cardioPreference as 'incline_walk' | 'bike' | 'none'
    },
    dietaryRestrictions: {
      allergies: allergies.value.join(', '),
      dietaryPattern: dietaryPattern.value as 'none' | 'halal' | 'kosher' | 'vegetarian' | 'pescatarian' | 'vegan'
    }
  })

  if (result.success) {
    toast.add({
      title: 'Preferences Updated',
      description: 'Your preferences have been saved.',
      icon: 'i-lucide-check',
      color: 'success'
    })
  } else {
    toast.add({
      title: 'Error',
      description: result.error || 'Failed to save preferences',
      icon: 'i-lucide-x',
      color: 'error'
    })
  }
}
</script>

<template>
  <div>
    <UPageCard
      title="Preferences"
      description="Customize your meal planning experience."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        label="Save changes"
        color="neutral"
        class="w-fit lg:ms-auto"
        @click="saveSettings"
      />
    </UPageCard>

    <!-- BORING Mode -->
    <UPageCard variant="subtle" class="mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-primary/10">
            <UIcon name="i-lucide-lock" class="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 class="font-medium">
              BORING Mode
            </h3>
            <p class="text-sm text-muted">
              Same meals every day for maximum consistency
            </p>
          </div>
        </div>
        <USwitch v-model="preferences.boringMode" />
      </div>

      <USeparator class="my-6" />

      <div class="space-y-4">
        <div>
          <h4 class="font-medium mb-2">
            Meals per Day
          </h4>
          <div class="inline-flex rounded-md overflow-hidden border border-default">
            <UButton
              v-for="n in [2, 3, 4, 5]"
              :key="n"
              :variant="preferences.mealsPerDay === n ? 'solid' : 'ghost'"
              :color="preferences.mealsPerDay === n ? 'primary' : 'neutral'"
              size="sm"
              class="rounded-none"
              @click="preferences.mealsPerDay = n"
            >
              {{ n }}
            </UButton>
          </div>
        </div>
      </div>
    </UPageCard>

    <!-- Dietary Preferences -->
    <UPageCard
      title="Dietary Preferences"
      description="Allergies and restrictions."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    />

    <UPageCard variant="subtle" class="mb-6">
      <div class="space-y-6">
        <div>
          <h4 class="font-medium mb-3">
            Allergies
          </h4>
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="allergy in allergyOptions"
              :key="allergy.value"
              :variant="allergies.includes(allergy.value) ? 'solid' : 'outline'"
              :color="allergies.includes(allergy.value) ? 'error' : 'neutral'"
              size="sm"
              @click="toggleAllergy(allergy.value)"
            >
              {{ allergy.label }}
            </UButton>
          </div>
        </div>

        <USeparator />

        <div>
          <h4 class="font-medium mb-3">
            Dietary Pattern
          </h4>
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="pattern in dietaryPatternOptions"
              :key="pattern.value"
              :variant="dietaryPattern === pattern.value ? 'solid' : 'outline'"
              :color="dietaryPattern === pattern.value ? 'primary' : 'neutral'"
              size="sm"
              @click="selectDietaryPattern(pattern.value)"
            >
              {{ pattern.label }}
            </UButton>
          </div>
        </div>
      </div>
    </UPageCard>

    <!-- App Settings -->
    <UPageCard
      title="App Settings"
      description="Display and notification preferences."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    />

    <UPageCard variant="subtle">
      <div class="space-y-4">
        <div class="flex items-center justify-between py-2">
          <div>
            <div class="font-medium">
              Dark Mode
            </div>
            <div class="text-sm text-muted">
              Use dark theme
            </div>
          </div>
          <USwitch v-model="preferences.darkMode" />
        </div>

        <USeparator />

        <div class="flex items-center justify-between py-2">
          <div>
            <div class="font-medium">
              Meal Reminders
            </div>
            <div class="text-sm text-muted">
              Get notified when it's time to eat
            </div>
          </div>
          <USwitch v-model="preferences.notifications" />
        </div>

        <USeparator />

        <div class="flex items-center justify-between py-2">
          <div>
            <div class="font-medium">
              Weekly Check-in Reminders
            </div>
            <div class="text-sm text-muted">
              Reminder to log your progress
            </div>
          </div>
          <USwitch v-model="preferences.weeklyReminders" />
        </div>
      </div>
    </UPageCard>
  </div>
</template>
