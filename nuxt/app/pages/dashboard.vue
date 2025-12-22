<script setup lang="ts">
import { format } from 'date-fns'
import { useMacroCalculator } from '~/composables/useMacroCalculator'
import { useMealPlanGenerator } from '~/composables/useMealPlanGenerator'
import type { UserStats } from '~/composables/useMacroCalculator'
import type { RecipeData } from '~/composables/useMealPlans'
import { boringRecipes, type Recipe } from '~/data/recipes'

const toast = useToast()
const today = new Date()
const formattedDate = format(today, 'EEEE, MMMM d')

// API-backed composables
const { isAuthenticated, init: initAuth } = useAuth()
const progressLogs = useProgressLogs()
const mealPlans = useMealPlans()
const workoutPlans = useWorkoutPlans()

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

// Generate meal plan based on macro targets (fallback if no API plan)
const { generateMealPlan } = useMealPlanGenerator()
const generatedPlan = generateMealPlan(macroTargets.value)

// Convert generated meals to dashboard format
const times = ['8:00 AM', '12:30 PM', '6:30 PM']

// Slot display names
const slotNames: Record<string, string> = {
  meal_1: 'Breakfast',
  meal_2: 'Lunch',
  meal_3: 'Dinner',
  meal_4: 'Snack 1',
  meal_5: 'Snack 2'
}

// Use API meal plan if available, otherwise use generated plan
const meals = computed(() => {
  // Check if we have an API meal plan
  const apiMeals = mealPlans.getTodaysMeals.value

  if (apiMeals && apiMeals.length > 0) {
    return apiMeals.map((meal, index) => {
      // Check for inline recipeData first, then relationship
      const recipeData = meal.recipeData
      const recipeRelation = typeof meal.recipe === 'object' ? meal.recipe : null
      const slotKey = meal.slot as string
      const todayLog = progressLogs.getTodayLog.value
      const mealEaten = todayLog?.mealsEaten?.find(m => m.slot === slotKey)

      // Use recipeData if available (from recipes page), otherwise relationship
      if (recipeData) {
        return {
          id: index + 1,
          slot: slotNames[slotKey] || `Meal ${index + 1}`,
          slotKey,
          name: recipeData.name,
          time: times[index] || '12:00 PM',
          macros: {
            calories: recipeData.macros?.calories || 0,
            protein: recipeData.macros?.protein || 0,
            carbs: recipeData.macros?.carbs || 0,
            fat: recipeData.macros?.fat || 0
          },
          eaten: mealEaten?.eaten || false,
          ingredients: recipeData.ingredientsList || [],
          instructions: recipeData.instructions?.join('\n') || '',
          recipeId: undefined as number | undefined
        }
      }

      return {
        id: index + 1,
        slot: slotNames[slotKey] || `Meal ${index + 1}`,
        slotKey,
        name: recipeRelation?.name || `Meal ${index + 1}`,
        time: times[index] || '12:00 PM',
        macros: {
          calories: recipeRelation?.macros?.calories || 0,
          protein: recipeRelation?.macros?.protein || 0,
          carbs: 0,
          fat: 0
        },
        eaten: mealEaten?.eaten || false,
        ingredients: [],
        instructions: '',
        recipeId: typeof meal.recipe === 'number' ? meal.recipe : recipeRelation?.id
      }
    })
  }

  // Fallback to generated plan
  return generatedPlan.dayA.map((meal, index) => {
    const mealCarbs = meal.ingredients?.reduce((acc, ing) => acc + (ing.macros?.carbs || 0), 0) || 0
    const mealFat = meal.ingredients?.reduce((acc, ing) => acc + (ing.macros?.fat || 0), 0) || 0
    const slotKey = `meal_${index + 1}`
    const todayLog = progressLogs.getTodayLog.value
    const mealEaten = todayLog?.mealsEaten?.find(m => m.slot === slotKey)

    return {
      id: index + 1,
      slot: meal.slot,
      slotKey,
      name: meal.recipe,
      time: times[index] || '12:00 PM',
      macros: {
        calories: meal.macros.calories,
        protein: meal.macros.protein,
        carbs: mealCarbs,
        fat: mealFat
      },
      eaten: mealEaten?.eaten || false,
      ingredients: meal.ingredients || [],
      instructions: meal.instructions,
      recipeId: undefined as number | undefined
    }
  })
})

const macrosConsumed = computed(() =>
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

// Training state from API or defaults
const training = computed(() => {
  const todayWorkout = workoutPlans.getTodaysWorkout.value
  const todayLog = progressLogs.getTodayLog.value

  return {
    type: todayWorkout?.dayName || 'Push Day',
    exercises: todayWorkout?.exercises?.length || 6,
    completed: todayLog?.workoutCompleted || false
  }
})

// Cardio state from API or defaults
const cardio = computed(() => {
  const plan = workoutPlans.activePlan.value
  const todayLog = progressLogs.getTodayLog.value

  return {
    type: plan?.cardio?.type === 'incline_walk'
      ? 'Incline Walk'
      : plan?.cardio?.type === 'bike'
        ? 'Bike'
        : plan?.cardio?.type === 'stairs'
          ? 'Stair Climber'
          : plan?.cardio?.type === 'rowing' ? 'Rowing' : 'Incline Walk',
    duration: plan?.cardio?.durationMinutes || 20,
    completed: todayLog?.cardioCompleted || false
  }
})

// Steps state from API or defaults
const steps = computed(() => {
  const plan = workoutPlans.activePlan.value
  const todayLog = progressLogs.getTodayLog.value

  return {
    current: todayLog?.steps || 0,
    target: plan?.dailyStepsTarget || 10000
  }
})

const getProgress = (current: number, target: number) => {
  return Math.min((current / target) * 100, 100)
}

// Toggle meal eaten - now saves to API
const isTogglingMeal = ref<number | null>(null)
const toggleMealEaten = async (mealId: number) => {
  const meal = meals.value.find(m => m.id === mealId)
  if (!meal) return

  isTogglingMeal.value = mealId
  const newEatenState = !meal.eaten

  try {
    const result = await progressLogs.markMealEaten(
      meal.slotKey,
      newEatenState,
      meal.recipeId
    )

    if (!result.success) {
      toast.add({
        title: 'Error',
        description: result.error || 'Failed to update meal status',
        color: 'error'
      })
    }
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to save meal status',
      color: 'error'
    })
  } finally {
    isTogglingMeal.value = null
  }
}

// Toggle workout completed - saves to API
const isTogglingWorkout = ref(false)
const toggleWorkoutCompleted = async () => {
  isTogglingWorkout.value = true

  try {
    const result = await progressLogs.markWorkoutCompleted(!training.value.completed)

    if (!result.success) {
      toast.add({
        title: 'Error',
        description: result.error || 'Failed to update workout status',
        color: 'error'
      })
    }
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to save workout status',
      color: 'error'
    })
  } finally {
    isTogglingWorkout.value = false
  }
}

// Toggle cardio completed - saves to API
const isTogglingCardio = ref(false)
const toggleCardioCompleted = async () => {
  isTogglingCardio.value = true

  try {
    const result = await progressLogs.markCardioCompleted(
      !cardio.value.completed,
      cardio.value.duration
    )

    if (!result.success) {
      toast.add({
        title: 'Error',
        description: result.error || 'Failed to update cardio status',
        color: 'error'
      })
    }
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to save cardio status',
      color: 'error'
    })
  } finally {
    isTogglingCardio.value = false
  }
}

// Swap meal modal
const swapMealModalOpen = ref(false)
const swappingMeal = ref<typeof meals.value[0] | null>(null)

const openSwapMealModal = (meal: typeof meals.value[0]) => {
  swappingMeal.value = meal
  swapMealModalOpen.value = true
}

// Edit meal modal
const editMealModalOpen = ref(false)
const editingMeal = ref<typeof meals.value[0] | null>(null)

const openEditMealModal = (meal: typeof meals.value[0]) => {
  editingMeal.value = meal
  editMealModalOpen.value = true
}

// Swap modal - recipe selection and scope
const recipeSearchQuery = ref('')
const selectedRecipeForSwap = ref<Recipe | null>(null)
const swapScope = ref<'current_week' | 'all_weeks'>('all_weeks')
const isSwappingMeal = ref(false)

const filteredRecipes = computed(() => {
  const query = recipeSearchQuery.value.toLowerCase()
  if (!query) return boringRecipes
  return boringRecipes.filter(recipe =>
    recipe.name.toLowerCase().includes(query)
    || recipe.tags?.some(tag => tag.toLowerCase().includes(query))
  )
})

const selectRecipeForSwap = (recipe: Recipe) => {
  selectedRecipeForSwap.value = recipe
}

const confirmSwapMeal = async () => {
  if (!swappingMeal.value || !selectedRecipeForSwap.value) return

  isSwappingMeal.value = true
  try {
    // Convert Recipe to RecipeData format
    const recipeData: RecipeData = {
      id: selectedRecipeForSwap.value.id,
      name: selectedRecipeForSwap.value.name,
      description: selectedRecipeForSwap.value.description,
      prepTime: selectedRecipeForSwap.value.prepTime,
      macros: selectedRecipeForSwap.value.macros,
      ingredientsList: selectedRecipeForSwap.value.ingredientsList,
      instructions: selectedRecipeForSwap.value.instructions,
      source: selectedRecipeForSwap.value.source,
      tags: selectedRecipeForSwap.value.tags
    }

    const result = await mealPlans.swapMealWithRecipeData(
      swappingMeal.value.slotKey,
      recipeData,
      swapScope.value
    )

    if (result.success) {
      toast.add({
        title: 'Meal Swapped',
        description: `${selectedRecipeForSwap.value.name} is now your ${swappingMeal.value.slot}`,
        color: 'success'
      })
      swapMealModalOpen.value = false
      selectedRecipeForSwap.value = null
      recipeSearchQuery.value = ''
    } else {
      toast.add({
        title: 'Error',
        description: result.error || 'Failed to swap meal',
        color: 'error'
      })
    }
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to swap meal',
      color: 'error'
    })
  } finally {
    isSwappingMeal.value = false
  }
}

// Initialize API data on mount
onMounted(async () => {
  // First, initialize auth to fetch user from token
  await initAuth()

  // Then load data if authenticated
  if (isAuthenticated.value) {
    await Promise.all([
      progressLogs.init(),
      mealPlans.init(),
      workoutPlans.init()
    ])
  }
})

// Watch for auth changes
watch(isAuthenticated, async (authenticated) => {
  if (authenticated) {
    await Promise.all([
      progressLogs.init(),
      mealPlans.init(),
      workoutPlans.init()
    ])
  }
})
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
                  :disabled="isTogglingMeal === meal.id"
                  @click.stop="toggleMealEaten(meal.id)"
                >
                  <UIcon
                    v-if="isTogglingMeal === meal.id"
                    name="i-lucide-loader-2"
                    class="w-4 h-4 animate-spin"
                    :class="meal.eaten ? 'text-white' : 'text-primary'"
                  />
                  <UIcon
                    v-else-if="meal.eaten"
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
                    @click.stop="openSwapMealModal(meal)"
                  >
                    Swap Meal
                  </UButton>
                  <UButton
                    variant="ghost"
                    color="neutral"
                    size="sm"
                    icon="i-lucide-pencil"
                    @click.stop="openEditMealModal(meal)"
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
              :loading="isTogglingWorkout"
              @click="toggleWorkoutCompleted"
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
              :loading="isTogglingCardio"
              @click="toggleCardioCompleted"
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

    <!-- Swap Meal Modal -->
    <UModal v-model:open="swapMealModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">
                Swap {{ swappingMeal?.slot }}
              </h3>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="swapMealModalOpen = false"
              />
            </div>
          </template>

          <div class="space-y-4">
            <!-- Scope selection -->
            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="text-sm font-medium mb-2">
                Apply swap to:
              </p>
              <div class="flex w-full rounded-md overflow-hidden border border-default">
                <UButton
                  :variant="swapScope === 'all_weeks' ? 'solid' : 'ghost'"
                  :color="swapScope === 'all_weeks' ? 'primary' : 'neutral'"
                  size="sm"
                  class="flex-1 rounded-none"
                  @click="swapScope = 'all_weeks'"
                >
                  All Weeks
                </UButton>
                <UButton
                  :variant="swapScope === 'current_week' ? 'solid' : 'ghost'"
                  :color="swapScope === 'current_week' ? 'primary' : 'neutral'"
                  size="sm"
                  class="flex-1 rounded-none"
                  @click="swapScope = 'current_week'"
                >
                  Current Week Only
                </UButton>
              </div>
            </div>

            <!-- Search -->
            <UInput
              v-model="recipeSearchQuery"
              placeholder="Search recipes..."
              icon="i-lucide-search"
              class="w-full"
            />

            <!-- Recipe list -->
            <div class="max-h-80 overflow-y-auto space-y-2">
              <button
                v-for="recipe in filteredRecipes"
                :key="recipe.id"
                type="button"
                class="w-full p-3 rounded-lg text-left transition-all border"
                :class="selectedRecipeForSwap?.id === recipe.id
                  ? 'bg-primary/10 border-primary'
                  : 'bg-elevated border-default hover:border-muted'"
                @click="selectRecipeForSwap(recipe)"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium">
                      {{ recipe.name }}
                    </div>
                    <div class="text-xs text-muted mt-0.5">
                      {{ recipe.prepTime }} min prep
                    </div>
                  </div>
                  <div class="text-right text-sm">
                    <div class="font-medium">
                      {{ recipe.macros.calories }} kcal
                    </div>
                    <div class="flex items-center gap-1.5 text-xs">
                      <span class="text-blue-500">{{ recipe.macros.protein }}p</span>
                      <span class="text-amber-500">{{ recipe.macros.carbs }}c</span>
                      <span class="text-rose-500">{{ recipe.macros.fat }}f</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" color="neutral" @click="swapMealModalOpen = false">
                Cancel
              </UButton>
              <UButton
                :disabled="!selectedRecipeForSwap"
                :loading="isSwappingMeal"
                @click="confirmSwapMeal"
              >
                Swap Meal
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Edit Meal Modal (placeholder) -->
    <UModal v-model:open="editMealModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">
                Edit {{ editingMeal?.slot }}
              </h3>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="editMealModalOpen = false"
              />
            </div>
          </template>

          <div class="space-y-4">
            <p class="text-muted">
              Edit functionality coming soon. For now, use "Swap Meal" to change to a different recipe.
            </p>
            <div v-if="editingMeal" class="p-4 rounded-lg bg-muted/20">
              <div class="font-medium">
                {{ editingMeal.name }}
              </div>
              <div class="text-sm text-muted mt-1">
                {{ editingMeal.macros.calories }} kcal · {{ editingMeal.macros.protein }}p · {{ editingMeal.macros.carbs }}c · {{ editingMeal.macros.fat }}f
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" color="neutral" @click="editMealModalOpen = false">
                Close
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </UDashboardPanel>
</template>
