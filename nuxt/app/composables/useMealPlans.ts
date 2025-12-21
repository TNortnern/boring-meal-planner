import { createSharedComposable } from '@vueuse/core'
import { apiGet, apiPost, apiPatch, formatDateForPayload, type PayloadListResponse, type PayloadDocResponse } from '~/utils/api'

export interface MealSlot {
  id?: string
  slot: 'meal_1' | 'meal_2' | 'meal_3' | 'meal_4' | 'meal_5'
  recipe: number | string | { id: number, name: string, macros?: { calories: number, protein: number } }
  portionMultiplier?: number
}

export interface MealPlan {
  id: number
  name: string
  user: string | number
  weekStartDate: string
  rotationType: 'same_daily' | 'ab_rotation' | 'custom'
  macroTargets?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  dayA?: {
    meals: MealSlot[]
  }
  dayB?: {
    meals: MealSlot[]
  }
  customDays?: Array<{
    dayOfWeek: string
    meals: MealSlot[]
  }>
  shoppingList?: Array<{
    ingredient: number | string
    totalAmount: number
    unit: string
  }>
  mealPrepInstructions?: string
  isActive?: boolean
}

export interface CreateMealPlanInput {
  name: string
  weekStartDate: Date
  rotationType: 'same_daily' | 'ab_rotation' | 'custom'
  macroTargets: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  dayA?: { meals: MealSlot[] }
  dayB?: { meals: MealSlot[] }
}

const _useMealPlans = () => {
  const { user } = useAuth()

  const activePlan = ref<MealPlan | null>(null)
  const allPlans = ref<MealPlan[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Fetch the active meal plan for current user
  const fetchActivePlan = async () => {
    if (!user.value) return

    isLoading.value = true
    error.value = null

    try {
      const result = await apiGet<PayloadListResponse<MealPlan>>('/api/meal-plans', {
        'where[user][equals]': user.value.id,
        'where[isActive][equals]': true,
        'sort': '-weekStartDate',
        'limit': 1,
        'depth': 2 // Populate recipe relationships
      })

      if (result.success && result.data) {
        activePlan.value = result.data.docs[0] || null
      } else {
        error.value = result.error || 'Failed to fetch meal plan'
      }
    } finally {
      isLoading.value = false
    }
  }

  // Fetch all meal plans for history
  const fetchAllPlans = async () => {
    if (!user.value) return

    isLoading.value = true
    error.value = null

    try {
      const result = await apiGet<PayloadListResponse<MealPlan>>('/api/meal-plans', {
        'where[user][equals]': user.value.id,
        'sort': '-weekStartDate',
        'limit': 20
      })

      if (result.success && result.data) {
        allPlans.value = result.data.docs
      }
    } finally {
      isLoading.value = false
    }
  }

  // Create a new meal plan
  const createPlan = async (data: CreateMealPlanInput) => {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    isLoading.value = true
    error.value = null

    try {
      // First, deactivate any existing active plans
      if (activePlan.value) {
        const deactivateResult = await apiPatch(`/api/meal-plans/${activePlan.value.id}`, { isActive: false })
        if (!deactivateResult.success) {
          error.value = 'Failed to deactivate existing plan'
          return { success: false, error: error.value }
        }
      }

      const result = await apiPost<PayloadDocResponse<MealPlan>>('/api/meal-plans', {
        ...data,
        user: user.value.id,
        weekStartDate: formatDateForPayload(data.weekStartDate),
        isActive: true
      })

      if (result.success && result.data) {
        activePlan.value = result.data.doc
        allPlans.value.unshift(result.data.doc)
        return { success: true, data: result.data.doc }
      }

      error.value = result.error || 'Failed to create meal plan'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Update the active meal plan
  const updatePlan = async (id: number, data: Partial<MealPlan>) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await apiPatch<PayloadDocResponse<MealPlan>>(`/api/meal-plans/${id}`, data)

      if (result.success && result.data) {
        if (activePlan.value?.id === id) {
          activePlan.value = result.data.doc
        }
        const index = allPlans.value.findIndex(p => p.id === id)
        if (index !== -1) {
          allPlans.value[index] = result.data.doc
        }
        return { success: true, data: result.data.doc }
      }

      error.value = result.error || 'Failed to update meal plan'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Swap a meal in the active plan
  const swapMeal = async (day: 'dayA' | 'dayB', slotIndex: number, newRecipeId: number) => {
    if (!activePlan.value) return { success: false, error: 'No active meal plan' }

    const dayMeals = activePlan.value[day]?.meals || []
    const updatedMeals = [...dayMeals]
    const existingMeal = updatedMeals[slotIndex]

    if (slotIndex >= 0 && slotIndex < updatedMeals.length && existingMeal) {
      updatedMeals[slotIndex] = {
        ...existingMeal,
        slot: existingMeal.slot,
        recipe: newRecipeId
      }
    }

    return updatePlan(activePlan.value.id, {
      [day]: { meals: updatedMeals }
    })
  }

  // Update portion multiplier for a meal
  const updatePortion = async (day: 'dayA' | 'dayB', slotIndex: number, multiplier: number) => {
    if (!activePlan.value) return { success: false, error: 'No active meal plan' }

    const dayMeals = activePlan.value[day]?.meals || []
    const updatedMeals = [...dayMeals]
    const existingMeal = updatedMeals[slotIndex]

    if (slotIndex >= 0 && slotIndex < updatedMeals.length && existingMeal) {
      updatedMeals[slotIndex] = {
        ...existingMeal,
        slot: existingMeal.slot,
        recipe: existingMeal.recipe,
        portionMultiplier: multiplier
      }
    }

    return updatePlan(activePlan.value.id, {
      [day]: { meals: updatedMeals }
    })
  }

  // Get today's meals based on rotation type
  const getTodaysMeals = computed(() => {
    if (!activePlan.value) return []

    const today = new Date()
    const dayOfWeek = today.getDay()

    if (activePlan.value.rotationType === 'same_daily') {
      return activePlan.value.dayA?.meals || []
    }

    if (activePlan.value.rotationType === 'ab_rotation') {
      // Alternate: even days = Day A, odd days = Day B
      return dayOfWeek % 2 === 0
        ? activePlan.value.dayA?.meals || []
        : activePlan.value.dayB?.meals || []
    }

    // Custom rotation - find today's day
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const todayName = dayNames[dayOfWeek]
    const customDay = activePlan.value.customDays?.find(d => d.dayOfWeek === todayName)
    return customDay?.meals || activePlan.value.dayA?.meals || []
  })

  // Check if today is Day A or Day B
  const isABDayA = computed(() => {
    const today = new Date()
    return today.getDay() % 2 === 0
  })

  // Initialize
  const init = async () => {
    if (user.value) {
      await fetchActivePlan()
    }
  }

  return {
    // State
    activePlan,
    allPlans,
    isLoading,
    error,

    // Computed
    getTodaysMeals,
    isABDayA,

    // Methods
    fetchActivePlan,
    fetchAllPlans,
    createPlan,
    updatePlan,
    swapMeal,
    updatePortion,
    init
  }
}

export const useMealPlans = createSharedComposable(_useMealPlans)
