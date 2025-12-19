<script setup lang="ts">
const { state, getHeightCm: _getHeightCm, getWeightKg: _getWeightKg } = useOnboarding()

const goalLabels = {
  cut: 'Cut (Lose Fat)',
  maintain: 'Maintain Weight',
  gain: 'Gain (Build Muscle)'
}

const macroColors = {
  protein: 'text-blue-500',
  carbs: 'text-amber-500',
  fat: 'text-rose-500'
}
</script>

<template>
  <div class="space-y-8">
    <!-- Macro targets -->
    <div v-if="state.macroTargets" class="p-6 rounded-xl bg-elevated border border-default">
      <div class="text-center mb-6">
        <div class="text-4xl font-bold text-primary">
          {{ state.macroTargets.calories.toLocaleString() }}
        </div>
        <div class="text-sm text-muted">
          calories per day
        </div>
      </div>

      <!-- Macro breakdown -->
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-2xl font-semibold" :class="macroColors.protein">
            {{ state.macroTargets.protein }}g
          </div>
          <div class="text-xs text-muted uppercase tracking-wide">
            Protein
          </div>
        </div>
        <div>
          <div class="text-2xl font-semibold" :class="macroColors.carbs">
            {{ state.macroTargets.carbs }}g
          </div>
          <div class="text-xs text-muted uppercase tracking-wide">
            Carbs
          </div>
        </div>
        <div>
          <div class="text-2xl font-semibold" :class="macroColors.fat">
            {{ state.macroTargets.fat }}g
          </div>
          <div class="text-xs text-muted uppercase tracking-wide">
            Fat
          </div>
        </div>
      </div>

      <!-- Additional targets -->
      <div class="mt-6 pt-6 border-t border-default grid grid-cols-2 gap-4 text-sm">
        <div class="flex justify-between">
          <span class="text-muted">Fiber</span>
          <span class="font-medium">{{ state.macroTargets.fiber }}g</span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted">Water</span>
          <span class="font-medium">{{ state.macroTargets.water }}L</span>
        </div>
      </div>
    </div>

    <!-- Plan summary -->
    <div class="space-y-3">
      <h3 class="font-medium">
        Your plan
      </h3>
      <div class="grid gap-3">
        <div class="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <span class="text-muted">Goal</span>
          <span class="font-medium">{{ goalLabels[state.goal] }}</span>
        </div>
        <div class="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <span class="text-muted">Meals per day</span>
          <span class="font-medium">{{ state.mealsPerDay }}</span>
        </div>
        <div class="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <span class="text-muted">Training</span>
          <span class="font-medium">{{ state.liftingDays }} days/week</span>
        </div>
        <div class="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <span class="text-muted">Cardio</span>
          <span class="font-medium capitalize">
            {{ state.cardioPreference === 'incline_walk' ? 'Incline Walk' : state.cardioPreference }}
          </span>
        </div>
      </div>
    </div>

    <!-- Boring Level badge -->
    <div class="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary">
      <UIcon name="i-lucide-lock" class="w-5 h-5" />
      <span class="text-sm font-medium capitalize">
        {{ state.boringLevel.replace('_', ' ') }} Mode
      </span>
      <span class="text-xs ml-auto">
        {{ state.boringLevel === 'maximum_boring' ? 'Same meal every day'
          : state.boringLevel === 'very_boring' ? 'A/B rotation'
            : state.boringLevel === 'boring_ish' ? '3-4 meals/week'
              : 'Daily variety' }}
      </span>
    </div>

    <!-- What's next -->
    <div class="p-4 rounded-lg border border-default">
      <h3 class="font-medium mb-2">
        What happens next?
      </h3>
      <ul class="text-sm text-muted space-y-2">
        <li class="flex items-start gap-2">
          <UIcon name="i-lucide-utensils" class="w-4 h-4 mt-0.5 text-primary" />
          We'll generate your weekly meal plan with boring, effective recipes
        </li>
        <li class="flex items-start gap-2">
          <UIcon name="i-lucide-dumbbell" class="w-4 h-4 mt-0.5 text-primary" />
          You'll get a training split matched to your schedule
        </li>
        <li class="flex items-start gap-2">
          <UIcon name="i-lucide-shopping-cart" class="w-4 h-4 mt-0.5 text-primary" />
          A shopping list will be ready for meal prep
        </li>
      </ul>
    </div>
  </div>
</template>
