<script setup lang="ts">
const { state } = useOnboarding()

const mealOptions = [2, 3, 4, 5]

const cardioOptions = [
  { value: 'incline_walk', label: 'Incline Walk', icon: 'i-lucide-footprints' },
  { value: 'bike', label: 'Bike', icon: 'i-lucide-bike' },
  { value: 'none', label: 'None', icon: 'i-lucide-x' }
] as const
</script>

<template>
  <div class="space-y-8">
    <!-- Cooking preference -->
    <div class="space-y-3">
      <USwitch
        v-model="state.cookEverything"
        label="I cook all my meals"
        description="We'll only suggest recipes you can prepare at home"
      />
    </div>

    <!-- Repeat meals -->
    <div class="space-y-3">
      <USwitch
        v-model="state.repeatMeals"
        label="Repeat meals daily"
        description="Same boring meals every day (recommended for consistency)"
      />
    </div>

    <!-- Meals per day -->
    <div class="space-y-3">
      <label class="text-sm font-medium">Meals per day</label>
      <div class="flex gap-2">
        <UButton
          v-for="n in mealOptions"
          :key="n"
          :variant="state.mealsPerDay === n ? 'solid' : 'outline'"
          :color="state.mealsPerDay === n ? 'primary' : 'neutral'"
          @click="state.mealsPerDay = n"
        >
          {{ n }}
        </UButton>
      </div>
      <p class="text-xs text-muted">
        We'll divide your daily calories across these meals.
      </p>
    </div>

    <!-- Cardio preference -->
    <div class="space-y-3">
      <label class="text-sm font-medium">Preferred cardio</label>
      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="option in cardioOptions"
          :key="option.value"
          type="button"
          class="p-4 rounded-lg border-2 text-center transition-all"
          :class="[
            state.cardioPreference === option.value
              ? 'border-primary bg-primary/5'
              : 'border-default hover:border-muted'
          ]"
          @click="state.cardioPreference = option.value"
        >
          <UIcon :name="option.icon" class="w-6 h-6 mx-auto mb-2" />
          <div class="text-sm font-medium">
            {{ option.label }}
          </div>
        </button>
      </div>
    </div>

    <!-- Fast food preference -->
    <div class="space-y-3">
      <label class="text-sm font-medium">Fast food / Restaurant options</label>
      <p class="text-xs text-muted">
        Do you want fast food or restaurant suggestions?
      </p>
      <div class="grid grid-cols-3 gap-3">
        <button
          type="button"
          class="p-4 rounded-lg border-2 text-center transition-all"
          :class="[
            state.fastFoodPreference === 'none'
              ? 'border-primary bg-primary/5'
              : 'border-default hover:border-muted'
          ]"
          @click="state.fastFoodPreference = 'none'"
        >
          <UIcon name="i-lucide-chef-hat" class="w-6 h-6 mx-auto mb-2" />
          <div class="text-sm font-medium">
            No thanks
          </div>
          <div class="text-xs text-muted mt-1">
            I cook everything
          </div>
        </button>
        <button
          type="button"
          class="p-4 rounded-lg border-2 text-center transition-all"
          :class="[
            state.fastFoodPreference === 'healthy'
              ? 'border-primary bg-primary/5'
              : 'border-default hover:border-muted'
          ]"
          @click="state.fastFoodPreference = 'healthy'"
        >
          <UIcon name="i-lucide-salad" class="w-6 h-6 mx-auto mb-2" />
          <div class="text-sm font-medium">
            Healthy options
          </div>
          <div class="text-xs text-muted mt-1">
            Chipotle, Subway, etc.
          </div>
        </button>
        <button
          type="button"
          class="p-4 rounded-lg border-2 text-center transition-all"
          :class="[
            state.fastFoodPreference === 'doordash'
              ? 'border-primary bg-primary/5'
              : 'border-default hover:border-muted'
          ]"
          @click="state.fastFoodPreference = 'doordash'"
        >
          <UIcon name="i-lucide-truck" class="w-6 h-6 mx-auto mb-2" />
          <div class="text-sm font-medium">
            DoorDash friendly
          </div>
          <div class="text-xs text-muted mt-1">
            All delivery options
          </div>
        </button>
      </div>
    </div>

    <!-- BORING Level -->
    <div class="space-y-3">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium">Meal variety level</label>
        <UBadge color="primary" variant="subtle" size="xs">
          Recommended: Very Boring
        </UBadge>
      </div>
      <div class="grid gap-3">
        <button
          type="button"
          class="p-4 rounded-lg border-2 text-left transition-all"
          :class="[
            state.boringLevel === 'not_boring'
              ? 'border-primary bg-primary/5'
              : 'border-default hover:border-muted'
          ]"
          @click="state.boringLevel = 'not_boring'"
        >
          <div class="font-medium">
            Not Boring
          </div>
          <p class="text-sm text-muted mt-1">
            Variety-focused with different meals daily
          </p>
        </button>

        <button
          type="button"
          class="p-4 rounded-lg border-2 text-left transition-all"
          :class="[
            state.boringLevel === 'boring_ish'
              ? 'border-primary bg-primary/5'
              : 'border-default hover:border-muted'
          ]"
          @click="state.boringLevel = 'boring_ish'"
        >
          <div class="font-medium">
            Boring-ish
          </div>
          <p class="text-sm text-muted mt-1">
            Some variety with 3-4 different meals per week
          </p>
        </button>

        <button
          type="button"
          class="p-4 rounded-lg border-2 text-left transition-all"
          :class="[
            state.boringLevel === 'very_boring'
              ? 'border-primary bg-primary/5'
              : 'border-default hover:border-muted'
          ]"
          @click="state.boringLevel = 'very_boring'"
        >
          <div class="font-medium flex items-center gap-2">
            Very Boring
            <UIcon name="i-lucide-check" class="w-4 h-4 text-primary" />
          </div>
          <p class="text-sm text-muted mt-1">
            Same 2 meals rotating (A/B pattern)
          </p>
        </button>

        <button
          type="button"
          class="p-4 rounded-lg border-2 text-left transition-all"
          :class="[
            state.boringLevel === 'maximum_boring'
              ? 'border-primary bg-primary/5'
              : 'border-default hover:border-muted'
          ]"
          @click="state.boringLevel = 'maximum_boring'"
        >
          <div class="font-medium">
            Maximum Boring
          </div>
          <p class="text-sm text-muted mt-1">
            Same meal every single day. Peak efficiency.
          </p>
        </button>
      </div>
      <p class="text-xs text-muted">
        More boring means more consistency and easier meal prep.
      </p>
    </div>
  </div>
</template>
