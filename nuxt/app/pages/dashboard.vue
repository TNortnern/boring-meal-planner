<script setup lang="ts">
import { format } from 'date-fns'
import { useMacroCalculator } from '~/composables/useMacroCalculator'
import { useMealPlanGenerator } from '~/composables/useMealPlanGenerator'
import type { UserStats } from '~/composables/useMacroCalculator'

const today = new Date()
const formattedDate = format(today, 'EEEE, MMMM d')

// Get user stats from onboarding (stored in localStorage)
const userStatsStorage = useLocalStorage<UserStats>('boring-user-stats', {
  sex: 'male',
  age: 30,
  heightCm: 178,
  weightKg: 80,
  liftingDays: 4,
  dailySteps: 8000,
  goal: 'maintain',
  aggression: 'safe'
})

// Calculate macro targets
const { calculateMacros } = useMacroCalculator()
const macroTargets = computed(() => calculateMacros(userStatsStorage.value))

// Generate meal plan based on macro targets
const { generateMealPlan } = useMealPlanGenerator()
const generatedPlan = generateMealPlan(macroTargets.value)

// Get eaten status from localStorage
const eatenMealsKey = `eaten-meals-${format(today, 'yyyy-MM-dd')}`
const eatenMeals = useLocalStorage<number[]>(eatenMealsKey, [])

// Convert generated meals to dashboard format
const times = ['8:00 AM', '12:30 PM', '6:30 PM']
const meals = ref(
  generatedPlan.dayA.map((meal, index) => {
    const mealCarbs = meal.ingredients?.reduce((acc, ing) => acc + (ing.macros?.carbs || 0), 0) || 0
    const mealFat = meal.ingredients?.reduce((acc, ing) => acc + (ing.macros?.fat || 0), 0) || 0

    return {
      id: index + 1,
      slot: meal.slot,
      name: meal.recipe,
      time: times[index] || '12:00 PM',
      macros: {
        calories: meal.macros.calories,
        protein: meal.macros.protein,
        carbs: mealCarbs,
        fat: mealFat
      },
      eaten: eatenMeals.value.includes(index + 1),
      ingredients: meal.ingredients || [],
      instructions: meal.instructions
    }
  })
)

const macrosConsumed = ref(
  meals.value
    .filter(m => m.eaten)
    .reduce(
      (acc, m) => ({
        calories: acc.calories + m.macros.calories,
        protein: acc.protein + m.macros.protein,
        carbs: acc.carbs + m.macros.carbs,
        fat: acc.fat + m.macros.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )
)

const expandedMealId = ref<number | null>(null)

const toggleMealExpanded = (mealId: number) => {
  expandedMealId.value = expandedMealId.value === mealId ? null : mealId
}

const training = ref({
  type: 'Push Day',
  exercises: 6,
  completed: false
})

const cardio = ref({
  type: 'Incline Walk',
  duration: 20,
  completed: false
})

const steps = ref({
  current: 6500,
  target: 10000
})

const getProgress = (current: number, target: number) => {
  return Math.min((current / target) * 100, 100)
}

const toggleMealEaten = (mealId: number) => {
  const meal = meals.value.find(m => m.id === mealId)
  if (meal) {
    meal.eaten = !meal.eaten

    // Update localStorage
    if (meal.eaten) {
      if (!eatenMeals.value.includes(mealId)) {
        eatenMeals.value.push(mealId)
      }
    } else {
      const index = eatenMeals.value.indexOf(mealId)
      if (index > -1) {
        eatenMeals.value.splice(index, 1)
      }
    }

    // Recalculate consumed macros
    const consumed = meals.value
      .filter(m => m.eaten)
      .reduce(
        (acc, m) => ({
          calories: acc.calories + m.macros.calories,
          protein: acc.protein + m.macros.protein,
          carbs: acc.carbs + m.macros.carbs,
          fat: acc.fat + m.macros.fat
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      )
    macrosConsumed.value = consumed
  }
}
</script>

<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="Today">
      <template #leading>
        <UDashboardSidebarToggle />
      </template>

      <template #right>
        <div class="flex items-center gap-3">
          <span class="text-sm text-muted">{{ formattedDate }}</span>
          <UColorModeButton />
        </div>
      </template>
    </UDashboardNavbar>

    <UDashboardPanelContent class="px-4 sm:px-6 lg:px-8">
      <div class="space-y-6">
        <!-- Macro Progress -->
        <div class="grid gap-4 md:grid-cols-4">
          <!-- Calories -->
          <div class="p-4 rounded-xl bg-elevated border border-default">
            <div class="flex justify-between items-start mb-3">
              <div>
                <div class="text-2xl font-bold">
                  {{ macrosConsumed.calories.toLocaleString() }}
                </div>
                <div class="text-xs text-muted">
                  of {{ macroTargets.calories.toLocaleString() }} kcal
                </div>
              </div>
              <UIcon name="i-lucide-flame" class="w-5 h-5 text-orange-500" />
            </div>
            <UProgress
              :model-value="getProgress(macrosConsumed.calories, macroTargets.calories)"
              size="sm"
              color="warning"
            />
          </div>

          <!-- Protein -->
          <div class="p-4 rounded-xl bg-elevated border border-default">
            <div class="flex justify-between items-start mb-3">
              <div>
                <div class="text-2xl font-bold">
                  {{ macrosConsumed.protein }}g
                </div>
                <div class="text-xs text-muted">
                  of {{ macroTargets.protein }}g protein
                </div>
              </div>
              <UIcon name="i-lucide-beef" class="w-5 h-5 text-blue-500" />
            </div>
            <UProgress
              :model-value="getProgress(macrosConsumed.protein, macroTargets.protein)"
              size="sm"
              color="info"
            />
          </div>

          <!-- Carbs -->
          <div class="p-4 rounded-xl bg-elevated border border-default">
            <div class="flex justify-between items-start mb-3">
              <div>
                <div class="text-2xl font-bold">
                  {{ macrosConsumed.carbs }}g
                </div>
                <div class="text-xs text-muted">
                  of {{ macroTargets.carbs }}g carbs
                </div>
              </div>
              <UIcon name="i-lucide-wheat" class="w-5 h-5 text-amber-500" />
            </div>
            <UProgress
              :model-value="getProgress(macrosConsumed.carbs, macroTargets.carbs)"
              size="sm"
              color="warning"
            />
          </div>

          <!-- Fat -->
          <div class="p-4 rounded-xl bg-elevated border border-default">
            <div class="flex justify-between items-start mb-3">
              <div>
                <div class="text-2xl font-bold">
                  {{ macrosConsumed.fat }}g
                </div>
                <div class="text-xs text-muted">
                  of {{ macroTargets.fat }}g fat
                </div>
              </div>
              <UIcon name="i-lucide-droplets" class="w-5 h-5 text-rose-500" />
            </div>
            <UProgress
              :model-value="getProgress(macrosConsumed.fat, macroTargets.fat)"
              size="sm"
              color="error"
            />
          </div>
        </div>

        <!-- Meals -->
        <div>
          <h2 class="text-lg font-semibold mb-4">
            Meals
          </h2>
          <div class="space-y-3">
            <div
              v-for="meal in meals"
              :key="meal.id"
              class="rounded-xl bg-elevated border border-default overflow-hidden transition-all"
              :class="{ 'opacity-60': meal.eaten }"
            >
              <!-- Meal Header (Clickable) -->
              <div
                class="w-full p-4 flex items-center gap-4 hover:bg-muted/10 transition-colors cursor-pointer"
                @click="toggleMealExpanded(meal.id)"
              >
                <button
                  type="button"
                  class="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                  :class="meal.eaten ? 'bg-primary border-primary' : 'border-muted hover:border-primary'"
                  @click.stop="toggleMealEaten(meal.id)"
                >
                  <UIcon
                    v-if="meal.eaten"
                    name="i-lucide-check"
                    class="w-4 h-4 text-white"
                  />
                </button>

                <div class="flex-1 min-w-0 text-left">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-muted">{{ meal.slot }}</span>
                    <span class="text-xs text-muted">&middot;</span>
                    <span class="text-xs text-muted">{{ meal.time }}</span>
                  </div>
                  <div class="font-medium truncate" :class="{ 'line-through': meal.eaten }">
                    {{ meal.name }}
                  </div>
                </div>

                <div class="flex-shrink-0 text-right text-sm">
                  <div class="font-medium">
                    {{ meal.macros.calories }} kcal
                  </div>
                  <div class="text-xs text-muted">
                    {{ meal.macros.protein }}g protein
                  </div>
                </div>

                <UIcon
                  :name="expandedMealId === meal.id ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  class="w-5 h-5 text-muted flex-shrink-0"
                />
              </div>

              <!-- Expanded Content -->
              <div
                v-if="expandedMealId === meal.id"
                class="px-4 pb-4 space-y-4 border-t border-default"
              >
                <!-- Ingredients -->
                <div class="pt-4">
                  <h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
                    <UIcon name="i-lucide-list" class="w-4 h-4 text-primary" />
                    Ingredients
                  </h4>
                  <div class="space-y-2">
                    <div
                      v-for="ingredient in meal.ingredients"
                      :key="ingredient.name"
                      class="flex items-center justify-between p-2.5 rounded-lg bg-muted/20"
                    >
                      <div class="flex-1">
                        <span class="font-medium text-sm">{{ ingredient.name }}</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <span class="text-sm text-muted">{{ ingredient.amount }}</span>
                        <div v-if="ingredient.macros" class="flex items-center gap-2 text-xs">
                          <span class="text-blue-500">{{ ingredient.macros.protein }}p</span>
                          <span class="text-amber-500">{{ ingredient.macros.carbs }}c</span>
                          <span class="text-rose-500">{{ ingredient.macros.fat }}f</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Instructions -->
                <div>
                  <h4 class="text-sm font-semibold mb-2 flex items-center gap-2">
                    <UIcon name="i-lucide-chef-hat" class="w-4 h-4 text-primary" />
                    Preparation
                  </h4>
                  <p class="text-sm text-muted leading-relaxed">
                    {{ meal.instructions }}
                  </p>
                </div>

                <!-- Actions -->
                <div class="flex gap-2 pt-2">
                  <UButton
                    variant="outline"
                    color="neutral"
                    size="sm"
                    icon="i-lucide-repeat"
                  >
                    Swap Meal
                  </UButton>
                  <UButton
                    variant="ghost"
                    color="neutral"
                    size="sm"
                    icon="i-lucide-pencil"
                  >
                    Edit
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Training & Activity -->
        <div class="grid gap-4 md:grid-cols-3">
          <!-- Training -->
          <div class="p-4 rounded-xl bg-elevated border border-default">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium">
                Training
              </h3>
              <UBadge
                :color="training.completed ? 'primary' : 'neutral'"
                variant="subtle"
                size="sm"
              >
                {{ training.completed ? 'Done' : 'Pending' }}
              </UBadge>
            </div>
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-primary/10">
                <UIcon name="i-lucide-dumbbell" class="w-5 h-5 text-primary" />
              </div>
              <div>
                <div class="font-medium">
                  {{ training.type }}
                </div>
                <div class="text-sm text-muted">
                  {{ training.exercises }} exercises
                </div>
              </div>
            </div>
            <UButton
              class="w-full mt-4"
              :variant="training.completed ? 'outline' : 'solid'"
              @click="training.completed = !training.completed"
            >
              {{ training.completed ? 'Mark Incomplete' : 'Start Workout' }}
            </UButton>
          </div>

          <!-- Cardio -->
          <div class="p-4 rounded-xl bg-elevated border border-default">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium">
                Cardio
              </h3>
              <UBadge
                :color="cardio.completed ? 'primary' : 'neutral'"
                variant="subtle"
                size="sm"
              >
                {{ cardio.completed ? 'Done' : 'Pending' }}
              </UBadge>
            </div>
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-primary/10">
                <UIcon name="i-lucide-footprints" class="w-5 h-5 text-primary" />
              </div>
              <div>
                <div class="font-medium">
                  {{ cardio.type }}
                </div>
                <div class="text-sm text-muted">
                  {{ cardio.duration }} minutes
                </div>
              </div>
            </div>
            <UButton
              class="w-full mt-4"
              :variant="cardio.completed ? 'outline' : 'solid'"
              color="neutral"
              @click="cardio.completed = !cardio.completed"
            >
              {{ cardio.completed ? 'Undo' : 'Mark Complete' }}
            </UButton>
          </div>

          <!-- Steps -->
          <div class="p-4 rounded-xl bg-elevated border border-default">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium">
                Steps
              </h3>
              <span class="text-sm text-muted">
                {{ Math.round(getProgress(steps.current, steps.target)) }}%
              </span>
            </div>
            <div class="flex items-center gap-3 mb-3">
              <div class="p-2 rounded-lg bg-primary/10">
                <UIcon name="i-lucide-activity" class="w-5 h-5 text-primary" />
              </div>
              <div>
                <div class="font-medium">
                  {{ steps.current.toLocaleString() }}
                </div>
                <div class="text-sm text-muted">
                  of {{ steps.target.toLocaleString() }} goal
                </div>
              </div>
            </div>
            <UProgress :model-value="getProgress(steps.current, steps.target)" size="sm" />
          </div>
        </div>

        <!-- BORING Mode indicator -->
        <div class="flex items-center justify-center gap-2 py-3 text-sm text-muted">
          <UIcon name="i-lucide-lock" class="w-4 h-4" />
          <span>BORING Mode active — Same meals, every day</span>
        </div>
      </div>
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>
