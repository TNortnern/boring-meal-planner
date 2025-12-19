<script setup lang="ts">
const { state } = useOnboarding()

const goals = [
  {
    value: 'cut',
    label: 'Cut',
    description: 'Lose fat while maintaining muscle',
    icon: 'i-lucide-trending-down'
  },
  {
    value: 'maintain',
    label: 'Maintain',
    description: 'Stay at your current weight',
    icon: 'i-lucide-equal'
  },
  {
    value: 'gain',
    label: 'Gain',
    description: 'Build muscle with minimal fat',
    icon: 'i-lucide-trending-up'
  }
] as const

const aggressionOptions = [
  { value: 'safe', label: 'Safe', description: 'Slower, more sustainable' },
  { value: 'aggressive', label: 'Aggressive', description: 'Faster, harder to maintain' }
] as const
</script>

<template>
  <div class="space-y-8">
    <!-- Goal selection -->
    <div class="grid gap-4">
      <button
        v-for="goal in goals"
        :key="goal.value"
        type="button"
        class="p-4 rounded-lg border-2 text-left transition-all"
        :class="[
          state.goal === goal.value
            ? 'border-primary bg-primary/5'
            : 'border-default hover:border-muted'
        ]"
        @click="state.goal = goal.value"
      >
        <div class="flex items-start gap-4">
          <div
            class="p-2 rounded-lg"
            :class="state.goal === goal.value ? 'bg-primary/10 text-primary' : 'bg-muted'"
          >
            <UIcon :name="goal.icon" class="w-6 h-6" />
          </div>
          <div>
            <div class="font-medium">
              {{ goal.label }}
            </div>
            <div class="text-sm text-muted">
              {{ goal.description }}
            </div>
          </div>
          <UIcon
            v-if="state.goal === goal.value"
            name="i-lucide-check-circle"
            class="w-5 h-5 text-primary ml-auto"
          />
        </div>
      </button>
    </div>

    <!-- Aggression level (only for cut/gain) -->
    <div v-if="state.goal !== 'maintain'" class="space-y-3">
      <label class="text-sm font-medium">How aggressive?</label>
      <div class="flex gap-3">
        <button
          v-for="option in aggressionOptions"
          :key="option.value"
          type="button"
          class="flex-1 p-3 rounded-lg border-2 text-center transition-all"
          :class="[
            state.aggression === option.value
              ? 'border-primary bg-primary/5'
              : 'border-default hover:border-muted'
          ]"
          @click="state.aggression = option.value"
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

    <!-- Deadline (optional) -->
    <div v-if="state.goal !== 'maintain'" class="space-y-2">
      <label class="text-sm font-medium">Target date (optional)</label>
      <UInput
        v-model="state.deadlineDate"
        type="date"
        placeholder="When do you want to reach your goal?"
      />
      <p class="text-xs text-muted">
        Setting a deadline helps us calculate a realistic pace.
      </p>
    </div>
  </div>
</template>
