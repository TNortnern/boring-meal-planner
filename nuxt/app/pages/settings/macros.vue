<script setup lang="ts">
import { useMacroCalculator } from '~/composables/useMacroCalculator'

const { calculateMacros } = useMacroCalculator()
const { user, updateProfile } = useAuth()
const toast = useToast()

// User stats derived from profile
const userStats = computed(() => ({
  sex: (user.value?.sex || 'male') as 'male' | 'female',
  age: user.value?.age || 28,
  heightCm: user.value?.height?.value || 178,
  weightKg: user.value?.currentWeight?.value || 82.5,
  liftingDays: user.value?.liftingDaysPerWeek || 4,
  dailySteps: user.value?.dailyStepsEstimate || 8000
}))

const goal = ref<'cut' | 'maintain' | 'gain'>(user.value?.goal || 'cut')
const aggression = ref<'safe' | 'aggressive'>(user.value?.aggression || 'safe')

// Update when user data loads
watch(user, (newUser) => {
  if (newUser) {
    goal.value = newUser.goal || 'cut'
    aggression.value = newUser.aggression || 'safe'
    // Load custom macros from user if they have them saved
    if (newUser.macroTargets?.calories) {
      useCustomMacros.value = true
      customMacros.value = {
        calories: newUser.macroTargets.calories,
        protein: newUser.macroTargets.protein || 180,
        carbs: newUser.macroTargets.carbs || 200,
        fat: newUser.macroTargets.fat || 70
      }
    }
  }
}, { immediate: true })

const calculatedMacros = computed(() => {
  return calculateMacros({
    ...userStats.value,
    goal: goal.value,
    aggression: aggression.value
  })
})

const useCustomMacros = ref(false)
const customMacros = ref({
  calories: 2100,
  protein: 180,
  carbs: 200,
  fat: 70
})

const activeMacros = computed(() => {
  return useCustomMacros.value ? customMacros.value : calculatedMacros.value
})

const goalOptions = [
  { value: 'cut', label: 'Cut', description: 'Lose fat while preserving muscle' },
  { value: 'maintain', label: 'Maintain', description: 'Stay at current weight' },
  { value: 'gain', label: 'Gain', description: 'Build muscle with minimal fat' }
]

async function saveSettings() {
  const macros = activeMacros.value

  const result = await updateProfile({
    goal: goal.value,
    aggression: aggression.value,
    macroTargets: {
      calories: macros.calories,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat,
      fiber: calculatedMacros.value.fiber,
      water: calculatedMacros.value.water
    }
  })

  if (result.success) {
    toast.add({
      title: 'Macros Updated',
      description: 'Your macro targets have been saved.',
      icon: 'i-lucide-check',
      color: 'success'
    })
  } else {
    toast.add({
      title: 'Error',
      description: result.error || 'Failed to save macros',
      icon: 'i-lucide-x',
      color: 'error'
    })
  }
}
</script>

<template>
  <div>
    <UPageCard
      title="Macro Targets"
      description="Your daily nutrition goals."
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

    <!-- Goal Selection -->
    <UPageCard variant="subtle" class="mb-6">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium">
              Goal
            </h3>
            <p class="text-sm text-muted">
              What are you trying to achieve?
            </p>
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-3">
          <button
            v-for="option in goalOptions"
            :key="option.value"
            type="button"
            class="p-4 rounded-xl text-left transition-colors"
            :class="goal === option.value
              ? 'bg-primary/10 border-2 border-primary'
              : 'bg-muted/30 border border-default hover:border-muted'"
            @click="goal = option.value as typeof goal"
          >
            <div class="font-medium">
              {{ option.label }}
            </div>
            <div class="text-sm text-muted">
              {{ option.description }}
            </div>
          </button>
        </div>
      </div>

      <USeparator class="my-6" />

      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-medium">
            Aggression Level
          </h3>
          <p class="text-sm text-muted">
            {{ aggression === 'safe' ? 'Conservative for sustainable results' : 'Faster results, requires more discipline' }}
          </p>
        </div>
        <UButtonGroup>
          <UButton
            :variant="aggression === 'safe' ? 'solid' : 'outline'"
            :color="aggression === 'safe' ? 'primary' : 'neutral'"
            size="sm"
            @click="aggression = 'safe'"
          >
            Safe
          </UButton>
          <UButton
            :variant="aggression === 'aggressive' ? 'solid' : 'outline'"
            :color="aggression === 'aggressive' ? 'primary' : 'neutral'"
            size="sm"
            @click="aggression = 'aggressive'"
          >
            Aggressive
          </UButton>
        </UButtonGroup>
      </div>
    </UPageCard>

    <!-- Calculated Macros Display -->
    <UPageCard
      title="Calculated Targets"
      description="Based on your profile and goal."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    />

    <UPageCard variant="subtle" class="mb-6">
      <div class="grid gap-4 md:grid-cols-4">
        <div class="text-center p-4 rounded-lg bg-muted/30">
          <div class="text-2xl font-bold">
            {{ calculatedMacros.calories }}
          </div>
          <div class="text-sm text-muted">
            Calories
          </div>
        </div>
        <div class="text-center p-4 rounded-lg bg-muted/30">
          <div class="text-2xl font-bold text-blue-500">
            {{ calculatedMacros.protein }}g
          </div>
          <div class="text-sm text-muted">
            Protein
          </div>
        </div>
        <div class="text-center p-4 rounded-lg bg-muted/30">
          <div class="text-2xl font-bold text-amber-500">
            {{ calculatedMacros.carbs }}g
          </div>
          <div class="text-sm text-muted">
            Carbs
          </div>
        </div>
        <div class="text-center p-4 rounded-lg bg-muted/30">
          <div class="text-2xl font-bold text-rose-500">
            {{ calculatedMacros.fat }}g
          </div>
          <div class="text-sm text-muted">
            Fat
          </div>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2 mt-4 pt-4 border-t border-default">
        <div class="flex justify-between text-sm">
          <span class="text-muted">Fiber</span>
          <span class="font-medium">{{ calculatedMacros.fiber }}g</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-muted">Water</span>
          <span class="font-medium">{{ calculatedMacros.water }}L</span>
        </div>
      </div>
    </UPageCard>

    <!-- Custom Override -->
    <UPageCard
      title="Custom Targets"
      description="Override calculated values with your own."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    />

    <UPageCard variant="subtle">
      <div class="flex items-center justify-between mb-4">
        <div>
          <span class="font-medium">Use Custom Macros</span>
          <p class="text-sm text-muted">
            Set your own targets instead of calculated values
          </p>
        </div>
        <USwitch v-model="useCustomMacros" />
      </div>

      <div v-if="useCustomMacros" class="grid gap-4 md:grid-cols-4 pt-4 border-t border-default">
        <UFormField label="Calories">
          <UInput v-model.number="customMacros.calories" type="number" />
        </UFormField>
        <UFormField label="Protein (g)">
          <UInput v-model.number="customMacros.protein" type="number" />
        </UFormField>
        <UFormField label="Carbs (g)">
          <UInput v-model.number="customMacros.carbs" type="number" />
        </UFormField>
        <UFormField label="Fat (g)">
          <UInput v-model.number="customMacros.fat" type="number" />
        </UFormField>
      </div>
    </UPageCard>
  </div>
</template>
