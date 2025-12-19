<script setup lang="ts">
const { state } = useOnboarding()

const liftingOptions = [
  { value: 0, label: 'None', description: 'No weight training' },
  { value: 2, label: '1-2 days', description: 'Light routine' },
  { value: 4, label: '3-4 days', description: 'Moderate routine' },
  { value: 6, label: '5-6 days', description: 'Intense routine' }
]

const stepOptions = [
  { value: 3000, label: '<5k', description: 'Sedentary' },
  { value: 6000, label: '5-7k', description: 'Light activity' },
  { value: 9000, label: '8-10k', description: 'Active' },
  { value: 12000, label: '10k+', description: 'Very active' }
]
</script>

<template>
  <div class="space-y-8">
    <!-- Lifting days -->
    <div class="space-y-3">
      <label class="text-sm font-medium">Weight training per week</label>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="option in liftingOptions"
          :key="option.value"
          type="button"
          class="p-3 rounded-lg border-2 text-left transition-all"
          :class="[
            state.liftingDays === option.value
              ? 'border-primary bg-primary/5'
              : 'border-default hover:border-muted'
          ]"
          @click="state.liftingDays = option.value"
        >
          <div class="font-medium text-sm">
            {{ option.label }}
          </div>
          <div class="text-xs text-muted">
            {{ option.description }}
          </div>
        </button>
      </div>
    </div>

    <!-- Daily steps -->
    <div class="space-y-3">
      <label class="text-sm font-medium">Average daily steps</label>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="option in stepOptions"
          :key="option.value"
          type="button"
          class="p-3 rounded-lg border-2 text-left transition-all"
          :class="[
            Math.abs(state.dailySteps - option.value) < 2000
              ? 'border-primary bg-primary/5'
              : 'border-default hover:border-muted'
          ]"
          @click="state.dailySteps = option.value"
        >
          <div class="font-medium text-sm">
            {{ option.label }}
          </div>
          <div class="text-xs text-muted">
            {{ option.description }}
          </div>
        </button>
      </div>
      <p class="text-xs text-muted">
        Don't have a step tracker? Estimate based on your typical day.
      </p>
    </div>
  </div>
</template>
