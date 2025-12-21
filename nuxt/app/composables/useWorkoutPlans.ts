import { createSharedComposable } from '@vueuse/core'
import { apiGet, apiPost, apiPatch, type PayloadListResponse, type PayloadDocResponse } from '~/utils/api'

export interface WorkoutExercise {
  id?: string
  exercise: number | string | { id: number, name: string }
  sets: number
  reps: string
  restSeconds?: number
  notes?: string
  isLocked?: boolean
}

export interface Workout {
  id?: string
  dayName: string
  dayOfWeek?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  exercises: WorkoutExercise[]
}

export interface WorkoutPlan {
  id: number
  name: string
  user: string | number
  splitType: 'full_body' | 'upper_lower' | 'ppl' | 'ppl_upper' | 'bro_split' | 'custom'
  daysPerWeek: number
  goal: 'maintain' | 'strength' | 'hypertrophy'
  workouts: Workout[]
  cardio?: {
    type?: 'incline_walk' | 'bike' | 'stairs' | 'rowing' | 'none'
    durationMinutes?: number
    frequency?: string
  }
  dailyStepsTarget?: number
  isActive?: boolean
}

export interface CreateWorkoutPlanInput {
  name: string
  splitType: WorkoutPlan['splitType']
  daysPerWeek: number
  goal: WorkoutPlan['goal']
  workouts: Workout[]
  cardio?: WorkoutPlan['cardio']
  dailyStepsTarget?: number
}

const _useWorkoutPlans = () => {
  const { user } = useAuth()

  const activePlan = ref<WorkoutPlan | null>(null)
  const allPlans = ref<WorkoutPlan[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Fetch the active workout plan for current user
  const fetchActivePlan = async () => {
    if (!user.value) return

    isLoading.value = true
    error.value = null

    try {
      const result = await apiGet<PayloadListResponse<WorkoutPlan>>('/api/workout-plans', {
        'where[user][equals]': user.value.id,
        'where[isActive][equals]': true,
        'limit': 1,
        'depth': 2 // Populate exercise relationships
      })

      if (result.success && result.data) {
        activePlan.value = result.data.docs[0] || null
      } else {
        error.value = result.error || 'Failed to fetch workout plan'
      }
    } finally {
      isLoading.value = false
    }
  }

  // Fetch all workout plans for history
  const fetchAllPlans = async () => {
    if (!user.value) return

    isLoading.value = true
    error.value = null

    try {
      const result = await apiGet<PayloadListResponse<WorkoutPlan>>('/api/workout-plans', {
        'where[user][equals]': user.value.id,
        'sort': '-createdAt',
        'limit': 20
      })

      if (result.success && result.data) {
        allPlans.value = result.data.docs
      }
    } finally {
      isLoading.value = false
    }
  }

  // Create a new workout plan
  const createPlan = async (data: CreateWorkoutPlanInput) => {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    isLoading.value = true
    error.value = null

    try {
      // First, deactivate any existing active plans
      if (activePlan.value) {
        const deactivateResult = await apiPatch(`/api/workout-plans/${activePlan.value.id}`, { isActive: false })
        if (!deactivateResult.success) {
          error.value = 'Failed to deactivate existing plan'
          return { success: false, error: error.value }
        }
      }

      const result = await apiPost<PayloadDocResponse<WorkoutPlan>>('/api/workout-plans', {
        ...data,
        user: user.value.id,
        isActive: true
      })

      if (result.success && result.data) {
        activePlan.value = result.data.doc
        allPlans.value.unshift(result.data.doc)
        return { success: true, data: result.data.doc }
      }

      error.value = result.error || 'Failed to create workout plan'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Update the workout plan
  const updatePlan = async (id: number, data: Partial<WorkoutPlan>) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await apiPatch<PayloadDocResponse<WorkoutPlan>>(`/api/workout-plans/${id}`, data)

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

      error.value = result.error || 'Failed to update workout plan'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Add an exercise to a workout day
  const addExercise = async (workoutIndex: number, exercise: WorkoutExercise) => {
    if (!activePlan.value) return { success: false, error: 'No active workout plan' }

    const updatedWorkouts = [...activePlan.value.workouts]
    const workout = updatedWorkouts[workoutIndex]

    if (!workout) return { success: false, error: 'Workout not found' }

    workout.exercises = [...workout.exercises, exercise]

    return updatePlan(activePlan.value.id, { workouts: updatedWorkouts })
  }

  // Remove an exercise from a workout day
  const removeExercise = async (workoutIndex: number, exerciseIndex: number) => {
    if (!activePlan.value) return { success: false, error: 'No active workout plan' }

    const updatedWorkouts = [...activePlan.value.workouts]
    const workout = updatedWorkouts[workoutIndex]

    if (!workout) return { success: false, error: 'Workout not found' }

    workout.exercises = workout.exercises.filter((_, i) => i !== exerciseIndex)

    return updatePlan(activePlan.value.id, { workouts: updatedWorkouts })
  }

  // Update an exercise in a workout day
  const updateExercise = async (workoutIndex: number, exerciseIndex: number, updates: Partial<WorkoutExercise>) => {
    if (!activePlan.value) return { success: false, error: 'No active workout plan' }

    const updatedWorkouts = [...activePlan.value.workouts]
    const workout = updatedWorkouts[workoutIndex]

    if (!workout) return { success: false, error: 'Workout not found' }
    if (!workout.exercises[exerciseIndex]) return { success: false, error: 'Exercise not found' }

    workout.exercises[exerciseIndex] = {
      ...workout.exercises[exerciseIndex],
      ...updates
    }

    return updatePlan(activePlan.value.id, { workouts: updatedWorkouts })
  }

  // Toggle exercise lock status
  const toggleExerciseLock = async (workoutIndex: number, exerciseIndex: number) => {
    if (!activePlan.value) return { success: false, error: 'No active workout plan' }

    const workout = activePlan.value.workouts[workoutIndex]
    const exercise = workout?.exercises[exerciseIndex]

    if (!exercise) return { success: false, error: 'Exercise not found' }

    return updateExercise(workoutIndex, exerciseIndex, { isLocked: !exercise.isLocked })
  }

  // Update cardio settings
  const updateCardio = async (cardio: WorkoutPlan['cardio']) => {
    if (!activePlan.value) return { success: false, error: 'No active workout plan' }

    return updatePlan(activePlan.value.id, { cardio })
  }

  // Update daily steps target
  const updateStepsTarget = async (stepsTarget: number) => {
    if (!activePlan.value) return { success: false, error: 'No active workout plan' }

    return updatePlan(activePlan.value.id, { dailyStepsTarget: stepsTarget })
  }

  // Get today's workout based on day of week
  const getTodaysWorkout = computed(() => {
    if (!activePlan.value) return null

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const today = dayNames[new Date().getDay()]

    // Try to find a workout assigned to today
    const todayWorkout = activePlan.value.workouts.find(w => w.dayOfWeek === today)
    if (todayWorkout) return todayWorkout

    // If no specific day assigned, return based on rotation
    const dayIndex = new Date().getDay()
    const workoutIndex = dayIndex % activePlan.value.workouts.length
    return activePlan.value.workouts[workoutIndex] || null
  })

  // Computed: is today a rest day
  const isRestDay = computed(() => {
    if (!activePlan.value) return true

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const today = dayNames[new Date().getDay()]

    // Check if there's a workout assigned to today
    const hasWorkout = activePlan.value.workouts.some(w => w.dayOfWeek === today)

    // If days are explicitly assigned, use that
    if (activePlan.value.workouts.some(w => w.dayOfWeek)) {
      return !hasWorkout
    }

    // Otherwise, assume they work out the specified number of days
    // This is a simple heuristic - could be improved
    return false
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
    getTodaysWorkout,
    isRestDay,

    // Methods
    fetchActivePlan,
    fetchAllPlans,
    createPlan,
    updatePlan,
    addExercise,
    removeExercise,
    updateExercise,
    toggleExerciseLock,
    updateCardio,
    updateStepsTarget,
    init
  }
}

export const useWorkoutPlans = createSharedComposable(_useWorkoutPlans)
