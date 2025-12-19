<script setup lang="ts">
const toast = useToast()
const colorMode = useColorMode()

const preferences = reactive({
  boringMode: true,
  mealsPerDay: 3,
  darkMode: colorMode.value === 'dark',
  notifications: true,
  weeklyReminders: true
})

// Watch for dark mode changes and sync with colorMode
watch(() => preferences.darkMode, (newValue) => {
  colorMode.preference = newValue ? 'dark' : 'light'
})

// Watch for external colorMode changes and sync with preferences
watch(() => colorMode.value, (newValue) => {
  preferences.darkMode = newValue === 'dark'
})

const allergies = ref<string[]>([])
const restrictions = ref<string[]>([])

const allergyOptions = [
  { value: 'dairy', label: 'Dairy' },
  { value: 'gluten', label: 'Gluten' },
  { value: 'nuts', label: 'Nuts' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'soy', label: 'Soy' },
  { value: 'shellfish', label: 'Shellfish' }
]

const restrictionOptions = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' }
]

function toggleAllergy(allergy: string) {
  const index = allergies.value.indexOf(allergy)
  if (index === -1) {
    allergies.value.push(allergy)
  } else {
    allergies.value.splice(index, 1)
  }
}

function toggleRestriction(restriction: string) {
  const index = restrictions.value.indexOf(restriction)
  if (index === -1) {
    restrictions.value.push(restriction)
  } else {
    restrictions.value.splice(index, 1)
  }
}

function saveSettings() {
  toast.add({
    title: 'Preferences Updated',
    description: 'Your preferences have been saved.',
    icon: 'i-lucide-check',
    color: 'success'
  })
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
          <UButtonGroup>
            <UButton
              v-for="n in [2, 3, 4, 5]"
              :key="n"
              :variant="preferences.mealsPerDay === n ? 'solid' : 'outline'"
              :color="preferences.mealsPerDay === n ? 'primary' : 'neutral'"
              size="sm"
              @click="preferences.mealsPerDay = n"
            >
              {{ n }}
            </UButton>
          </UButtonGroup>
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
            Dietary Restrictions
          </h4>
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="restriction in restrictionOptions"
              :key="restriction.value"
              :variant="restrictions.includes(restriction.value) ? 'solid' : 'outline'"
              :color="restrictions.includes(restriction.value) ? 'primary' : 'neutral'"
              size="sm"
              @click="toggleRestriction(restriction.value)"
            >
              {{ restriction.label }}
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
