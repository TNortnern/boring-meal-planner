<script setup lang="ts">
import { format, addDays, startOfWeek } from 'date-fns'
import { useMacroCalculator } from '~/composables/useMacroCalculator'
import { useMealPlanGenerator } from '~/composables/useMealPlanGenerator'
import type { UserStats } from '~/composables/useMacroCalculator'
import type { MealSlot } from '~/composables/useMealPlans'

const toast = useToast()
const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })

// API-backed composables
const { isAuthenticated } = useAuth()
const progressLogs = useProgressLogs()
const mealPlansApi = useMealPlans()

const rotationType = ref<'same_daily' | 'ab_rotation'>('same_daily')

// Sync rotation type with API plan
watch(() => mealPlansApi.activePlan.value?.rotationType, (apiRotation) => {
  if (apiRotation) {
    rotationType.value = apiRotation === 'ab_rotation' ? 'ab_rotation' : 'same_daily'
  }
}, { immediate: true })

const days = computed(() => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i)
    return {
      date,
      dayName: format(date, 'EEEE'),
      shortName: format(date, 'EEE'),
      dateStr: format(date, 'MMM d'),
      isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
      rotation: rotationType.value === 'ab_rotation' ? (i % 2 === 0 ? 'A' : 'B') : null
    }
  })
})

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

// Generate meal plan based on macro targets (fallback)
const { generateMealPlan } = useMealPlanGenerator()
const generatedMealPlan = ref(generateMealPlan(macroTargets.value))

// Regenerate meal plan when user stats change
watch(userStatsStorage, (newStats) => {
  const newTargets = calculateMacros(newStats)
  generatedMealPlan.value = generateMealPlan(newTargets)
}, { deep: true })

const expandedMealSlot = ref<string | null>(null)

const toggleMealExpanded = (slot: string) => {
  expandedMealSlot.value = expandedMealSlot.value === slot ? null : slot
}

// Get meals for a specific day - use API if available, fallback to generated
const getMealsForDay = (dayIndex: number) => {
  const apiPlan = mealPlansApi.activePlan.value

  if (apiPlan) {
    if (rotationType.value === 'same_daily') {
      return apiPlan.dayA?.meals || []
    }
    return dayIndex % 2 === 0
      ? apiPlan.dayA?.meals || []
      : apiPlan.dayB?.meals || []
  }

  // Fallback to generated plan
  if (rotationType.value === 'same_daily') {
    return generatedMealPlan.value.dayA
  }
  return dayIndex % 2 === 0 ? generatedMealPlan.value.dayA : generatedMealPlan.value.dayB
}

// Format meal for display
interface DisplayMeal {
  slot: string
  slotKey: string
  recipe: string
  macros: { calories: number, protein: number, carbs: number, fat: number }
  ingredients: Array<{ name: string, amount: string, macros?: { protein: number, carbs: number, fat: number } }>
  instructions: string
  recipeId?: number
  eaten: boolean
}

const getFormattedMealsForDay = (dayIndex: number): DisplayMeal[] => {
  const meals = getMealsForDay(dayIndex)
  const isApiPlan = !!mealPlansApi.activePlan.value

  if (isApiPlan) {
    return (meals as MealSlot[]).map((meal, index) => {
      // Check for inline recipeData first, then relationship
      const recipeData = meal.recipeData
      const recipeRelation = typeof meal.recipe === 'object' ? meal.recipe : null
      const slotKey = meal.slot
      const todayLog = progressLogs.getTodayLog.value
      const mealEaten = todayLog?.mealsEaten?.find(m => m.slot === slotKey)

      // Use recipeData if available, otherwise fall back to relationship
      if (recipeData) {
        return {
          slot: slotKey.replace('meal_', 'Meal '),
          slotKey,
          recipe: recipeData.name,
          macros: {
            calories: recipeData.macros?.calories || 0,
            protein: recipeData.macros?.protein || 0,
            carbs: recipeData.macros?.carbs || 0,
            fat: recipeData.macros?.fat || 0
          },
          ingredients: recipeData.ingredientsList || [],
          instructions: recipeData.instructions?.join('\n') || '',
          recipeId: undefined,
          eaten: mealEaten?.eaten || false
        }
      }

      return {
        slot: slotKey.replace('meal_', 'Meal '),
        slotKey,
        recipe: recipeRelation?.name || `Meal ${index + 1}`,
        macros: {
          calories: recipeRelation?.macros?.calories || 0,
          protein: recipeRelation?.macros?.protein || 0,
          carbs: 0,
          fat: 0
        },
        ingredients: [],
        instructions: '',
        recipeId: typeof meal.recipe === 'number' ? meal.recipe : recipeRelation?.id,
        eaten: mealEaten?.eaten || false
      }
    })
  }

  // Fallback format from generated plan
  return (meals as typeof generatedMealPlan.value['dayA']).map((meal, index) => {
    const slotKey = `meal_${index + 1}`
    const mealCarbs = meal.ingredients?.reduce((acc, ing) => acc + (ing.macros?.carbs || 0), 0) || 0
    const mealFat = meal.ingredients?.reduce((acc, ing) => acc + (ing.macros?.fat || 0), 0) || 0
    const todayLog = progressLogs.getTodayLog.value
    const mealEaten = todayLog?.mealsEaten?.find(m => m.slot === slotKey)

    return {
      slot: meal.slot,
      slotKey,
      recipe: meal.recipe,
      macros: {
        calories: meal.macros.calories,
        protein: meal.macros.protein,
        carbs: mealCarbs,
        fat: mealFat
      },
      ingredients: meal.ingredients || [],
      instructions: meal.instructions,
      eaten: mealEaten?.eaten || false
    }
  })
}

const totalDailyMacros = computed(() => {
  const meals = getFormattedMealsForDay(selectedDay.value)
  return {
    calories: meals.reduce((sum, m) => sum + m.macros.calories, 0),
    protein: meals.reduce((sum, m) => sum + m.macros.protein, 0),
    carbs: meals.reduce((sum, m) => sum + m.macros.carbs, 0),
    fat: meals.reduce((sum, m) => sum + m.macros.fat, 0)
  }
})

const selectedDay = ref(0)

const currentDay = computed(() => days.value[selectedDay.value])

const shoppingListOpen = ref(false)

// Shopping list from API or fallback
const shoppingList = computed(() => {
  const apiList = mealPlansApi.activePlan.value?.shoppingList
  if (apiList && apiList.length > 0) {
    return apiList.map(item => ({
      ingredient: typeof item.ingredient === 'object' ? (item.ingredient as { name: string }).name : `Item ${item.ingredient}`,
      amount: String(item.totalAmount || 1),
      unit: item.unit || 'unit',
      category: 'Groceries',
      purchased: false
    }))
  }

  // Fallback mock data
  return [
    { ingredient: 'Chicken Breast', amount: '2.5', unit: 'lbs', category: 'Proteins', purchased: false },
    { ingredient: 'Ground Turkey', amount: '1.5', unit: 'lbs', category: 'Proteins', purchased: false },
    { ingredient: 'Lean Ground Beef', amount: '1', unit: 'lb', category: 'Proteins', purchased: false },
    { ingredient: 'Eggs', amount: '1', unit: 'dozen', category: 'Proteins', purchased: false },
    { ingredient: 'White Rice', amount: '3', unit: 'cups', category: 'Carbs', purchased: false },
    { ingredient: 'Potatoes', amount: '4', unit: 'lbs', category: 'Carbs', purchased: false },
    { ingredient: 'Broccoli', amount: '2', unit: 'heads', category: 'Vegetables', purchased: false },
    { ingredient: 'Mixed Vegetables', amount: '2', unit: 'bags', category: 'Vegetables', purchased: false },
    { ingredient: 'Olive Oil', amount: '1', unit: 'bottle', category: 'Fats & Oils', purchased: false }
  ]
})

// Track purchased items via API (uses progressLogs.shoppingListPurchased)
const purchasedItems = computed(() => progressLogs.getTodayPurchasedItems.value)
const isTogglingItem = ref<string | null>(null)

const groupedShoppingList = computed(() => {
  const groups: Record<string, typeof shoppingList.value> = {}
  shoppingList.value.forEach((item) => {
    const itemWithPurchased = { ...item, purchased: purchasedItems.value.has(item.ingredient) }
    if (!groups[item.category]) {
      groups[item.category] = []
    }
    groups[item.category]!.push(itemWithPurchased)
  })
  return groups
})

const togglePurchased = async (ingredient: string) => {
  isTogglingItem.value = ingredient
  const currentlyPurchased = purchasedItems.value.has(ingredient)

  try {
    const result = await progressLogs.toggleShoppingItem(ingredient, !currentlyPurchased)
    if (!result.success) {
      toast.add({
        title: 'Error',
        description: result.error || 'Failed to update shopping list',
        color: 'error'
      })
    }
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to save shopping list',
      color: 'error'
    })
  } finally {
    isTogglingItem.value = null
  }
}

const resetPurchasedItems = async () => {
  // Reset all purchased items via API
  const todayLog = progressLogs.getTodayLog.value
  if (todayLog) {
    await progressLogs.updateLog(todayLog.id, { shoppingListPurchased: [] })
  }
}

const copyShoppingList = async () => {
  const text = Object.entries(groupedShoppingList.value)
    .map(([category, items]) => {
      const itemList = items
        .map(item => `  - ${item.ingredient} - ${item.amount} ${item.unit}`)
        .join('\n')
      return `${category}:\n${itemList}`
    })
    .join('\n\n')

  try {
    await navigator.clipboard.writeText(text)
    toast.add({ title: 'Copied', description: 'Shopping list copied to clipboard', color: 'success' })
  } catch {
    toast.add({ title: 'Error', description: 'Failed to copy shopping list', color: 'error' })
  }
}

// Toggle meal eaten - saves to API
const isTogglingMeal = ref<string | null>(null)
const toggleMealEaten = async (meal: DisplayMeal) => {
  isTogglingMeal.value = meal.slotKey
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

// Swap meal modal
const swapMealModalOpen = ref(false)
const swappingMeal = ref<DisplayMeal | null>(null)
const swappingMealIndex = ref<number>(0)

const openSwapMealModal = (meal: DisplayMeal, index: number) => {
  swappingMeal.value = meal
  swappingMealIndex.value = index
  swapMealModalOpen.value = true
}

// Edit meal modal
const editMealModalOpen = ref(false)
const editingMeal = ref<DisplayMeal | null>(null)
const editingMealIndex = ref<number>(0)

const openEditMealModal = (meal: DisplayMeal, index: number) => {
  editingMeal.value = meal
  editingMealIndex.value = index
  editMealModalOpen.value = true
}

// Save rotation type to API
const isSavingRotation = ref(false)
const updateRotationType = async (newType: 'same_daily' | 'ab_rotation') => {
  rotationType.value = newType

  if (mealPlansApi.activePlan.value) {
    isSavingRotation.value = true
    try {
      await mealPlansApi.updatePlan(mealPlansApi.activePlan.value.id, { rotationType: newType })
    } catch {
      toast.add({ title: 'Error', description: 'Failed to save rotation type', color: 'error' })
    } finally {
      isSavingRotation.value = false
    }
  }
}

// Initialize API data on mount
onMounted(async () => {
  if (isAuthenticated.value) {
    await Promise.all([
      progressLogs.init(),
      mealPlansApi.init()
    ])
  }
})

// Watch for auth changes
watch(isAuthenticated, async (authenticated) => {
  if (authenticated) {
    await Promise.all([
      progressLogs.init(),
      mealPlansApi.init()
    ])
  }
})
</script>

<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="Meal Plan">
      <template #leading>
        <UDashboardSidebarToggle />
      </template>

      <template #right>
        <div class="flex items-center gap-3">
          <UButton
            variant="outline"
            color="neutral"
            icon="i-lucide-shopping-cart"
            @click="shoppingListOpen = true"
          >
            Shopping List
          </UButton>
          <UColorModeButton />
        </div>
      </template>
    </UDashboardNavbar>

    <UDashboardPanelContent class="px-4 sm:px-6 lg:px-8">
      <div class="space-y-6">
        <!-- Rotation type toggle -->
        <div class="flex items-center justify-between p-4 rounded-xl bg-elevated border border-default">
          <div>
            <h3 class="font-medium">
              Meal Rotation
            </h3>
            <p class="text-sm text-muted">
              {{ rotationType === 'same_daily' ? 'Same boring meals every day' : 'Alternating A/B days' }}
            </p>
          </div>
          <UButtonGroup>
            <UButton
              :variant="rotationType === 'same_daily' ? 'solid' : 'outline'"
              :color="rotationType === 'same_daily' ? 'primary' : 'neutral'"
              size="sm"
              :loading="isSavingRotation && rotationType !== 'same_daily'"
              @click="updateRotationType('same_daily')"
            >
              Same Daily
            </UButton>
            <UButton
              :variant="rotationType === 'ab_rotation' ? 'solid' : 'outline'"
              :color="rotationType === 'ab_rotation' ? 'primary' : 'neutral'"
              size="sm"
              :loading="isSavingRotation && rotationType !== 'ab_rotation'"
              @click="updateRotationType('ab_rotation')"
            >
              A/B Rotation
            </UButton>
          </UButtonGroup>
        </div>

        <!-- Week view -->
        <div class="grid grid-cols-7 gap-2">
          <button
            v-for="(day, index) in days"
            :key="day.dateStr"
            type="button"
            class="p-3 rounded-lg text-center transition-all"
            :class="[
              selectedDay === index
                ? 'bg-primary text-white'
                : day.isToday
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-elevated border border-default hover:border-muted'
            ]"
            @click="selectedDay = index"
          >
            <div class="text-xs font-medium">
              {{ day.shortName }}
            </div>
            <div class="text-lg font-bold">
              {{ day.dateStr.split(' ')[1] }}
            </div>
            <UBadge
              v-if="day.rotation"
              :color="day.rotation === 'A' ? 'primary' : 'neutral'"
              variant="subtle"
              size="xs"
              class="mt-1"
            >
              Day {{ day.rotation }}
            </UBadge>
          </button>
        </div>

        <!-- Selected day meals -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 v-if="currentDay" class="text-lg font-semibold">
              {{ currentDay.dayName }}
              <span v-if="currentDay.rotation" class="text-muted font-normal">
                — Day {{ currentDay.rotation }}
              </span>
            </h2>
            <div class="text-sm">
              <span class="font-medium">{{ totalDailyMacros.calories }} kcal</span>
              <span class="text-muted mx-1">·</span>
              <span class="text-blue-500">{{ totalDailyMacros.protein }}p</span>
              <span class="text-muted mx-1">·</span>
              <span class="text-amber-500">{{ totalDailyMacros.carbs }}c</span>
              <span class="text-muted mx-1">·</span>
              <span class="text-rose-500">{{ totalDailyMacros.fat }}f</span>
            </div>
          </div>

          <div class="space-y-3">
            <div
              v-for="(meal, index) in getFormattedMealsForDay(selectedDay)"
              :key="meal.slotKey"
              class="rounded-xl bg-elevated border border-default overflow-hidden"
              :class="{ 'opacity-60': meal.eaten }"
            >
              <!-- Meal Header (Clickable) -->
              <div
                class="w-full p-4 flex items-center gap-4 hover:bg-muted/10 transition-colors cursor-pointer"
                @click="toggleMealExpanded(meal.slotKey)"
              >
                <!-- Eaten checkbox -->
                <button
                  type="button"
                  class="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                  :class="meal.eaten ? 'bg-primary border-primary' : 'border-muted hover:border-primary'"
                  :disabled="isTogglingMeal === meal.slotKey"
                  @click.stop="toggleMealEaten(meal)"
                >
                  <UIcon
                    v-if="isTogglingMeal === meal.slotKey"
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

                <div class="flex-1 text-left">
                  <div class="text-xs text-muted mb-1">
                    {{ meal.slot }}
                  </div>
                  <div class="font-medium" :class="{ 'line-through': meal.eaten }">
                    {{ meal.recipe }}
                  </div>
                </div>
                <div class="flex-shrink-0 text-right text-sm">
                  <div class="font-medium">
                    {{ meal.macros.calories }} kcal
                  </div>
                  <div class="flex items-center gap-1.5 text-xs">
                    <span class="text-blue-500">{{ meal.macros.protein }}p</span>
                    <span class="text-amber-500">{{ meal.macros.carbs }}c</span>
                    <span class="text-rose-500">{{ meal.macros.fat }}f</span>
                  </div>
                </div>
                <UIcon
                  :name="expandedMealSlot === meal.slotKey ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  class="w-5 h-5 text-muted flex-shrink-0"
                />
              </div>

              <!-- Expanded Content -->
              <div
                v-if="expandedMealSlot === meal.slotKey"
                class="px-4 pb-4 space-y-4 border-t border-default"
              >
                <!-- Ingredients -->
                <div v-if="meal.ingredients.length > 0" class="pt-4">
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
                <div v-if="meal.instructions">
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
                    @click.stop="openSwapMealModal(meal, index)"
                  >
                    Swap Meal
                  </UButton>
                  <UButton
                    variant="ghost"
                    color="neutral"
                    size="sm"
                    icon="i-lucide-pencil"
                    @click.stop="openEditMealModal(meal, index)"
                  >
                    Edit
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Meal prep instructions -->
        <div class="p-4 rounded-xl bg-muted/30 border border-default">
          <h3 class="font-medium mb-2 flex items-center gap-2">
            <UIcon name="i-lucide-chef-hat" class="w-5 h-5 text-primary" />
            Meal Prep Guide
          </h3>
          <p class="text-sm text-muted">
            Cook all proteins on Sunday. Portion into {{ rotationType === 'ab_rotation' ? '14' : '7' }} containers.
            Rice and vegetables can be prepped 3 days at a time for freshness.
          </p>
        </div>

        <!-- BORING mode indicator -->
        <div class="flex items-center justify-center gap-2 py-3 text-sm text-muted">
          <UIcon name="i-lucide-lock" class="w-4 h-4" />
          <span>BORING Mode — Limited variety for maximum consistency</span>
        </div>
      </div>
    </UDashboardPanelContent>

    <!-- Shopping List Slideover -->
    <USlideover v-model:open="shoppingListOpen">
      <template #content>
        <UDashboardSlideover
          title="Shopping List"
          description="Weekly grocery list based on your meal plan"
          @close="shoppingListOpen = false"
        >
          <div class="space-y-6">
            <!-- Category Groups -->
            <div
              v-for="(items, category) in groupedShoppingList"
              :key="category"
              class="space-y-3"
            >
              <div class="flex items-center gap-2 pb-2 border-b border-default">
                <UIcon
                  :name="category === 'Proteins' ? 'i-lucide-beef' : category === 'Carbs' ? 'i-lucide-wheat' : category === 'Vegetables' ? 'i-lucide-leaf' : 'i-lucide-droplet'"
                  class="w-4 h-4 text-primary"
                />
                <h3 class="font-semibold text-sm uppercase tracking-wide text-muted">
                  {{ category }}
                </h3>
              </div>

              <div class="space-y-2">
                <button
                  v-for="item in items"
                  :key="item.ingredient"
                  type="button"
                  class="w-full flex items-center gap-3 p-3 rounded-xl bg-elevated border border-default hover:border-primary transition-all group"
                  :class="{ 'opacity-50': item.purchased }"
                  :disabled="isTogglingItem === item.ingredient"
                  @click="togglePurchased(item.ingredient)"
                >
                  <!-- Checkbox -->
                  <div
                    class="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                    :class="item.purchased
                      ? 'bg-primary border-primary'
                      : 'border-muted group-hover:border-primary'"
                  >
                    <UIcon
                      v-if="isTogglingItem === item.ingredient"
                      name="i-lucide-loader-2"
                      class="w-3.5 h-3.5 animate-spin"
                      :class="item.purchased ? 'text-white' : 'text-primary'"
                    />
                    <UIcon
                      v-else-if="item.purchased"
                      name="i-lucide-check"
                      class="w-3.5 h-3.5 text-white"
                    />
                  </div>

                  <!-- Item details -->
                  <div class="flex-1 text-left min-w-0">
                    <div
                      class="font-medium transition-all"
                      :class="{ 'line-through': item.purchased }"
                    >
                      {{ item.ingredient }}
                    </div>
                  </div>

                  <!-- Quantity -->
                  <div class="flex-shrink-0">
                    <div class="px-2.5 py-1 rounded-md bg-muted/30">
                      <span class="text-sm font-medium">{{ item.amount }}</span>
                      <span class="text-xs text-muted ml-1">{{ item.unit }}</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Summary -->
            <div class="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted">Progress</span>
                <span class="font-medium">
                  {{ purchasedItems.size }} / {{ shoppingList.length }} items
                </span>
              </div>
              <UProgress
                :model-value="(purchasedItems.size / shoppingList.length) * 100"
                size="sm"
                class="mt-2"
              />
            </div>
          </div>

          <template #footer>
            <div class="space-y-2">
              <UButton
                block
                icon="i-lucide-copy"
                @click="copyShoppingList"
              >
                Copy to Clipboard
              </UButton>
              <UButton
                variant="outline"
                color="neutral"
                block
                icon="i-lucide-rotate-ccw"
                @click="resetPurchasedItems"
              >
                Reset All
              </UButton>
            </div>
          </template>
        </UDashboardSlideover>
      </template>
    </USlideover>
  </UDashboardPanel>
</template>
