import { createSharedComposable } from '@vueuse/core'
import { apiGet, apiPost, apiPatch, formatDateForPayload, isSameDay, type PayloadListResponse, type PayloadDocResponse } from '~/utils/api'

export type MealSlotType = 'meal_1' | 'meal_2' | 'meal_3' | 'meal_4' | 'meal_5'

export interface MealEatenEntry {
  slot: MealSlotType
  eaten: boolean
  recipe?: number | string
}

export interface ProgressLog {
  id: number
  user: string | number
  date: string
  weight?: {
    value?: number
    unit?: 'kg' | 'lbs'
  }
  waist?: {
    value?: number
    unit?: 'cm' | 'in'
  }
  steps?: number
  mealsEaten?: MealEatenEntry[]
  macrosConsumed?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
  }
  workoutCompleted?: boolean
  cardioCompleted?: boolean
  cardioMinutes?: number
  notes?: string
  isCheckInDay?: boolean
  photo?: number | string
}

export interface CreateProgressLogInput {
  date: Date
  weight?: { value: number, unit: 'kg' | 'lbs' }
  waist?: { value: number, unit: 'cm' | 'in' }
  steps?: number
  mealsEaten?: ProgressLog['mealsEaten']
  workoutCompleted?: boolean
  cardioCompleted?: boolean
  cardioMinutes?: number
  notes?: string
  isCheckInDay?: boolean
}

const _useProgressLogs = () => {
  const { user } = useAuth()

  const logs = ref<ProgressLog[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all progress logs for current user
  const fetchLogs = async (startDate?: Date, endDate?: Date) => {
    if (!user.value) return

    isLoading.value = true
    error.value = null

    try {
      const query: Record<string, string | number | boolean | undefined> = {
        'where[user][equals]': user.value.id,
        'sort': '-date',
        'limit': 100
      }

      if (startDate) {
        query['where[date][greater_than_equal]'] = formatDateForPayload(startDate)
      }
      if (endDate) {
        query['where[date][less_than_equal]'] = formatDateForPayload(endDate)
      }

      const result = await apiGet<PayloadListResponse<ProgressLog>>('/api/progress-logs', query)

      if (result.success && result.data) {
        logs.value = result.data.docs
      } else {
        error.value = result.error || 'Failed to fetch logs'
      }
    } finally {
      isLoading.value = false
    }
  }

  // Get today's log (or create one)
  const getTodayLog = computed(() => {
    const today = new Date()
    return logs.value.find(log => isSameDay(new Date(log.date), today))
  })

  // Create a new progress log
  const createLog = async (data: CreateProgressLogInput) => {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    isLoading.value = true
    error.value = null

    try {
      const result = await apiPost<PayloadDocResponse<ProgressLog>>('/api/progress-logs', {
        ...data,
        user: user.value.id,
        date: formatDateForPayload(data.date)
      })

      if (result.success && result.data) {
        logs.value.unshift(result.data.doc)
        return { success: true, data: result.data.doc }
      }

      error.value = result.error || 'Failed to create log'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Update an existing progress log
  const updateLog = async (id: number, data: Partial<ProgressLog>) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await apiPatch<PayloadDocResponse<ProgressLog>>(`/api/progress-logs/${id}`, data)

      if (result.success && result.data) {
        const index = logs.value.findIndex(log => log.id === id)
        if (index !== -1) {
          logs.value[index] = result.data.doc
        }
        return { success: true, data: result.data.doc }
      }

      error.value = result.error || 'Failed to update log'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Mark a meal as eaten/not eaten for today
  const markMealEaten = async (slot: string, eaten: boolean, recipeId?: number) => {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    const today = new Date()
    let todayLog = getTodayLog.value

    // Create today's log if it doesn't exist
    if (!todayLog) {
      const createResult = await createLog({ date: today, mealsEaten: [] })
      if (!createResult.success) return createResult
      todayLog = createResult.data
    }

    if (!todayLog) return { success: false, error: 'Failed to get today\'s log' }

    // Update the meals array
    const mealsEaten = [...(todayLog.mealsEaten || [])]
    const mealIndex = mealsEaten.findIndex(m => m.slot === slot)

    if (mealIndex >= 0) {
      mealsEaten[mealIndex] = { slot: slot as MealSlotType, eaten, recipe: recipeId }
    } else {
      mealsEaten.push({ slot: slot as MealSlotType, eaten, recipe: recipeId })
    }

    return updateLog(todayLog.id, { mealsEaten })
  }

  // Mark workout as completed
  const markWorkoutCompleted = async (completed: boolean) => {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    const today = new Date()
    const todayLog = getTodayLog.value

    if (!todayLog) {
      const createResult = await createLog({ date: today, workoutCompleted: completed })
      return createResult
    }

    return updateLog(todayLog.id, { workoutCompleted: completed })
  }

  // Mark cardio as completed
  const markCardioCompleted = async (completed: boolean, minutes?: number) => {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    const today = new Date()
    const todayLog = getTodayLog.value

    if (!todayLog) {
      const createResult = await createLog({
        date: today,
        cardioCompleted: completed,
        cardioMinutes: minutes
      })
      return createResult
    }

    return updateLog(todayLog.id, { cardioCompleted: completed, cardioMinutes: minutes })
  }

  // Update steps for today
  const updateSteps = async (steps: number) => {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    const today = new Date()
    const todayLog = getTodayLog.value

    if (!todayLog) {
      const createResult = await createLog({ date: today, steps })
      return createResult
    }

    return updateLog(todayLog.id, { steps })
  }

  // Computed: weight history from logs
  const weightHistory = computed(() => {
    return logs.value
      .filter(log => log.weight?.value)
      .map(log => ({
        date: new Date(log.date),
        weight: log.weight!.value!
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  })

  // Computed: current weight (most recent)
  const currentWeight = computed(() => {
    const sorted = [...weightHistory.value].sort((a, b) => b.date.getTime() - a.date.getTime())
    return sorted[0]?.weight || 0
  })

  // Initialize - fetch logs on mount
  const init = async () => {
    if (user.value) {
      await fetchLogs()
    }
  }

  return {
    // State
    logs,
    isLoading,
    error,

    // Computed
    getTodayLog,
    weightHistory,
    currentWeight,

    // Methods
    fetchLogs,
    createLog,
    updateLog,
    markMealEaten,
    markWorkoutCompleted,
    markCardioCompleted,
    updateSteps,
    init
  }
}

export const useProgressLogs = createSharedComposable(_useProgressLogs)
