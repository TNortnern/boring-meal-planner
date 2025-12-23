import { createSharedComposable } from '@vueuse/core'
import { apiGet, apiPost, apiPatch, formatDateForPayload, isSameDay, type PayloadListResponse, type PayloadDocResponse } from '~/utils/api'

export type MealSlotType = 'meal_1' | 'meal_2' | 'meal_3' | 'meal_4' | 'meal_5'

export interface MealEatenEntry {
  slot: MealSlotType
  eaten: boolean
  recipe?: number | string
}

export interface WorkoutSetData {
  setNumber: number
  reps: number
  weight: number
  completed: boolean
}

export interface WorkoutExerciseData {
  exerciseName: string
  sets: WorkoutSetData[]
}

export interface WorkoutSessionData {
  dayName: string
  exercises: WorkoutExerciseData[]
  startedAt?: string
  finishedAt?: string
  notes?: string
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
  workoutData?: WorkoutSessionData
  cardioCompleted?: boolean
  cardioMinutes?: number
  notes?: string
  isCheckInDay?: boolean
  photo?: number | string
  shoppingListPurchased?: string[]
  progressPhotos?: Array<{
    id?: string
    url: string
    type: 'front' | 'side' | 'back'
    uploadedAt?: string
  }>
  measurements?: {
    chest?: number
    arms?: number
    thighs?: number
    bodyFat?: number
  }
}

export interface CreateProgressLogInput {
  date: Date
  weight?: { value: number, unit: 'kg' | 'lbs' }
  waist?: { value: number, unit: 'cm' | 'in' }
  steps?: number
  mealsEaten?: ProgressLog['mealsEaten']
  workoutCompleted?: boolean
  workoutData?: WorkoutSessionData
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
  // Track if we're on client side to avoid SSR hydration mismatches with Date
  const isClient = ref(false)

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

  // Get today's log (or create one) - only evaluate on client to avoid SSR hydration mismatches
  const getTodayLog = computed(() => {
    if (!isClient.value) return undefined
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

  // Mark workout as completed with optional session data
  const markWorkoutCompleted = async (completed: boolean, workoutData?: WorkoutSessionData) => {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    const today = new Date()
    const todayLog = getTodayLog.value

    if (!todayLog) {
      const createResult = await createLog({
        date: today,
        workoutCompleted: completed,
        workoutData
      })
      return createResult
    }

    return updateLog(todayLog.id, { workoutCompleted: completed, workoutData })
  }

  // Get today's workout data if exists
  const getTodayWorkoutData = computed(() => {
    return getTodayLog.value?.workoutData || null
  })

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

  // Toggle shopping list item purchased state
  const toggleShoppingItem = async (ingredientName: string, purchased: boolean) => {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    const today = new Date()
    let todayLog = getTodayLog.value

    // Create today's log if it doesn't exist
    if (!todayLog) {
      const createResult = await createLog({ date: today })
      if (!createResult.success) return createResult
      todayLog = createResult.data
    }

    if (!todayLog) return { success: false, error: 'Failed to get today\'s log' }

    // Update the shopping list array
    const currentPurchased = [...(todayLog.shoppingListPurchased || [])]
    const itemIndex = currentPurchased.indexOf(ingredientName)

    if (purchased && itemIndex === -1) {
      currentPurchased.push(ingredientName)
    } else if (!purchased && itemIndex !== -1) {
      currentPurchased.splice(itemIndex, 1)
    }

    return updateLog(todayLog.id, { shoppingListPurchased: currentPurchased })
  }

  // Get purchased shopping items for today
  const getTodayPurchasedItems = computed(() => {
    const todayLog = getTodayLog.value
    return new Set(todayLog?.shoppingListPurchased || [])
  })

  // Add a full check-in (weight, measurements, etc.)
  const addCheckIn = async (data: {
    weight?: { value: number, unit: 'kg' | 'lbs' }
    waist?: { value: number, unit: 'cm' | 'in' }
    measurements?: { chest?: number, arms?: number, thighs?: number, bodyFat?: number }
    notes?: string
    isCheckInDay?: boolean
  }) => {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    const today = new Date()
    let todayLog = getTodayLog.value

    // Create today's log if it doesn't exist
    if (!todayLog) {
      const createResult = await createLog({
        date: today,
        weight: data.weight,
        waist: data.waist,
        notes: data.notes,
        isCheckInDay: data.isCheckInDay
      })
      if (!createResult.success) return createResult
      todayLog = createResult.data
    }

    if (!todayLog) return { success: false, error: 'Failed to get today\'s log' }

    // Update with all the check-in data
    return updateLog(todayLog.id, {
      weight: data.weight,
      waist: data.waist,
      measurements: data.measurements,
      notes: data.notes,
      isCheckInDay: data.isCheckInDay ?? true
    })
  }

  // Update weight for a specific date (used for historical entries)
  const addWeightForDate = async (weight: number, unit: 'kg' | 'lbs', date: Date) => {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    // Check if a log exists for this date
    const existingLog = logs.value.find(log => isSameDay(new Date(log.date), date))

    if (existingLog) {
      return updateLog(existingLog.id, { weight: { value: weight, unit } })
    }

    // Create a new log for that date
    return createLog({
      date,
      weight: { value: weight, unit }
    })
  }

  // Delete a log entry
  const deleteLog = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      await $fetch(`/api/progress-logs/${id}`, {
        method: 'DELETE'
      })

      // Remove from local state
      const index = logs.value.findIndex(log => log.id === id)
      if (index !== -1) {
        logs.value.splice(index, 1)
      }

      return { success: true }
    } catch {
      error.value = 'Failed to delete log'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Get all check-in logs (logs with isCheckInDay=true or measurements)
  const checkInHistory = computed(() => {
    return logs.value
      .filter(log => log.isCheckInDay || log.weight?.value || log.measurements)
      .map(log => ({
        id: log.id,
        date: new Date(log.date),
        weight: log.weight?.value,
        waist: log.waist?.value,
        chest: log.measurements?.chest,
        arms: log.measurements?.arms,
        thighs: log.measurements?.thighs,
        bodyFat: log.measurements?.bodyFat,
        notes: log.notes
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
  })

  // Get first and latest measurements for comparison (includes waist from separate field)
  const latestMeasurement = computed(() => {
    const logsWithMeasurements = logs.value.filter(log => log.measurements || log.waist?.value)
    if (logsWithMeasurements.length === 0) return null

    const sorted = [...logsWithMeasurements].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    const latest = sorted[0]
    if (!latest) return null

    return {
      waist: latest.waist?.value,
      chest: latest.measurements?.chest,
      arms: latest.measurements?.arms,
      thighs: latest.measurements?.thighs,
      bodyFat: latest.measurements?.bodyFat
    }
  })

  const firstMeasurement = computed(() => {
    const logsWithMeasurements = logs.value.filter(log => log.measurements || log.waist?.value)
    if (logsWithMeasurements.length === 0) return null

    const sorted = [...logsWithMeasurements].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    const first = sorted[0]
    if (!first) return null

    return {
      waist: first.waist?.value,
      chest: first.measurements?.chest,
      arms: first.measurements?.arms,
      thighs: first.measurements?.thighs,
      bodyFat: first.measurements?.bodyFat
    }
  })

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

  // Computed: workouts completed this week - only evaluate on client to avoid SSR hydration mismatches
  const workoutsThisWeek = computed(() => {
    if (!isClient.value) return 0 // Return 0 during SSR

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    weekAgo.setHours(0, 0, 0, 0)

    return logs.value.filter((log) => {
      const logDate = new Date(log.date)
      return log.workoutCompleted && logDate >= weekAgo
    }).length
  })

  // Computed: workout history this week with full data
  const workoutHistoryThisWeek = computed(() => {
    if (!isClient.value) return [] // Return empty during SSR

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    weekAgo.setHours(0, 0, 0, 0)

    return logs.value
      .filter((log) => {
        const logDate = new Date(log.date)
        return log.workoutCompleted && logDate >= weekAgo
      })
      .map(log => ({
        id: log.id,
        date: new Date(log.date),
        dayName: log.workoutData?.dayName || 'Workout',
        exerciseCount: log.workoutData?.exercises?.length || 0,
        totalSets: log.workoutData?.exercises?.reduce((sum, ex) =>
          sum + (ex.sets?.length || 0), 0) || 0,
        startedAt: log.workoutData?.startedAt,
        finishedAt: log.workoutData?.finishedAt
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
  })

  // Add a progress photo to the current day's log
  const addProgressPhoto = async (url: string, type: 'front' | 'side' | 'back' = 'front') => {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    const today = new Date()
    let todayLog = getTodayLog.value

    // Create today's log if it doesn't exist
    if (!todayLog) {
      const createResult = await createLog({ date: today })
      if (!createResult.success) return createResult
      todayLog = createResult.data
    }

    if (!todayLog) return { success: false, error: 'Failed to get today\'s log' }

    // Add the photo to the progressPhotos array
    const currentPhotos = todayLog.progressPhotos || []
    const newPhoto = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url,
      type,
      uploadedAt: formatDateForPayload(new Date())
    }

    return updateLog(todayLog.id, {
      progressPhotos: [...currentPhotos, newPhoto]
    })
  }

  // Get all progress photos across all logs
  const allProgressPhotos = computed(() => {
    const photos: Array<{ id: string, date: Date, type: string, url: string }> = []

    for (const log of logs.value) {
      if (log.progressPhotos) {
        for (const photo of log.progressPhotos) {
          photos.push({
            id: photo.id || `${log.id}-${photo.url}`,
            date: photo.uploadedAt ? new Date(photo.uploadedAt) : new Date(log.date),
            type: photo.type,
            url: photo.url
          })
        }
      }
    }

    return photos.sort((a, b) => b.date.getTime() - a.date.getTime())
  })

  // Initialize - fetch logs on mount
  const init = async () => {
    // Mark that we're on client side (for Date-dependent computed properties)
    isClient.value = true
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
    getTodayWorkoutData,
    weightHistory,
    currentWeight,
    workoutsThisWeek,
    workoutHistoryThisWeek,
    getTodayPurchasedItems,
    checkInHistory,
    latestMeasurement,
    firstMeasurement,
    allProgressPhotos,

    // Methods
    fetchLogs,
    createLog,
    updateLog,
    deleteLog,
    markMealEaten,
    markWorkoutCompleted,
    markCardioCompleted,
    updateSteps,
    toggleShoppingItem,
    addCheckIn,
    addWeightForDate,
    addProgressPhoto,
    init
  }
}

export const useProgressLogs = createSharedComposable(_useProgressLogs)
