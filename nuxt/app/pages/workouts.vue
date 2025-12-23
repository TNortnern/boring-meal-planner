<script setup lang="ts">
import type { WorkoutSessionData, WorkoutExerciseData } from '~/composables/useProgressLogs'

const toast = useToast()

// Local workout state (session management)
const {
  boringMode,
  currentPlan: localPlan,
  updateExerciseTarget: updateLocalExercise,
  addExercise: addLocalExercise,
  createWorkoutPlan: createLocalPlan,
  init: initWorkouts
} = useWorkouts()

// API-backed composables
const { isAuthenticated, init: initAuth } = useAuth()
const progressLogs = useProgressLogs()
const workoutPlansApi = useWorkoutPlans()

const { exercises: exerciseLibrary } = useExerciseData()

// Use API plan if available, otherwise fallback to local
const currentPlan = computed(() => {
  const apiPlan = workoutPlansApi.activePlan.value
  if (apiPlan) {
    return {
      name: apiPlan.name,
      type: apiPlan.splitType,
      daysPerWeek: apiPlan.daysPerWeek,
      currentWeek: 1,
      days: apiPlan.workouts.map(w => ({
        name: w.dayName,
        focus: w.dayOfWeek || '',
        exercises: w.exercises.map((e) => {
          // Resolve exercise name: from populated object, local library, or fallback
          let exerciseName = `Exercise ${e.exercise}`
          if (typeof e.exercise === 'object' && e.exercise !== null) {
            exerciseName = (e.exercise as { name: string }).name
          } else if (typeof e.exercise === 'number') {
            // Look up in local exercise library by ID
            const libraryExercise = exerciseLibrary.find(ex => ex.id === e.exercise)
            if (libraryExercise) {
              exerciseName = libraryExercise.name
            }
          } else if (typeof e.exercise === 'string') {
            // Exercise stored as name string
            exerciseName = e.exercise
          }
          return {
            name: exerciseName,
            sets: e.sets,
            reps: e.reps,
            targetWeight: 0,
            videoUrl: undefined,
            instructions: e.notes || undefined
          }
        })
      }))
    }
  }
  return localPlan.value
})

const _activeTab = ref('current')

// Mock workout split types
const splitTypes = [
  { value: 'ppl', label: 'Push/Pull/Legs', days: 6, description: 'Classic 6-day bodybuilding split' },
  { value: 'upper_lower', label: 'Upper/Lower', days: 4, description: '4-day strength focused split' },
  { value: 'full_body', label: 'Full Body', days: 3, description: '3-day full body training' },
  { value: 'bro_split', label: 'Bro Split', days: 5, description: 'One muscle group per day' }
]

const selectedDayIndex = ref(0)

const currentDay = computed(() => currentPlan.value.days[selectedDayIndex.value])

// Check if today's workout is already completed
const isTodayWorkoutCompleted = computed(() => {
  return progressLogs.getTodayLog.value?.workoutCompleted || false
})

const getTotalSets = (exercises: typeof currentPlan.value.days[0]['exercises']) => {
  return exercises.reduce((sum, ex) => sum + ex.sets, 0)
}

const _getTotalVolume = (exercises: typeof currentPlan.value.days[0]['exercises']) => {
  return exercises.reduce((sum, ex) => {
    const repParts = ex.reps.split('-')
    const avgReps = parseInt(repParts[0] || '0') || parseInt(ex.reps) || 0
    return sum + (ex.sets * avgReps * ex.targetWeight)
  }, 0)
}

const createNewPlanOpen = ref(false)
const newPlanType = ref<string | null>(null)

const editExerciseOpen = ref(false)
const editingExercise = ref<{ dayIndex: number, exerciseIndex: number } | null>(null)
const editingExerciseData = ref({
  sets: 0,
  reps: '',
  targetWeight: 0,
  videoUrl: '',
  instructions: ''
})

const openEditExercise = (dayIndex: number, exerciseIndex: number) => {
  editingExercise.value = { dayIndex, exerciseIndex }
  const day = currentPlan.value.days[dayIndex]
  const exercise = day?.exercises[exerciseIndex]
  if (exercise) {
    editingExerciseData.value = {
      sets: exercise.sets,
      reps: exercise.reps,
      targetWeight: exercise.targetWeight,
      videoUrl: exercise.videoUrl || '',
      instructions: exercise.instructions || ''
    }
  }
  editExerciseOpen.value = true
}

const isSavingExercise = ref(false)
const saveExercise = async () => {
  if (!editingExercise.value) return

  isSavingExercise.value = true

  try {
    // Update local state
    updateLocalExercise(
      editingExercise.value.dayIndex,
      editingExercise.value.exerciseIndex,
      editingExerciseData.value
    )

    // Note: API sync for exercises is disabled until the database is seeded with exercise data.
    // Exercise updates are managed locally for now.

    toast.add({
      title: 'Exercise Updated',
      description: 'Changes saved successfully',
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to save changes',
      color: 'error'
    })
  } finally {
    isSavingExercise.value = false
    editExerciseOpen.value = false
  }
}

const getExerciseToEdit = computed(() => {
  if (!editingExercise.value) return null
  const day = currentPlan.value.days[editingExercise.value.dayIndex]
  if (!day) return null
  return day.exercises[editingExercise.value.exerciseIndex] || null
})

// Active workout session tracking
const activeWorkoutOpen = ref(false)
const workingSetData = ref<{ [key: string]: { [setNum: number]: { reps: number, weight: number } } }>({})

// Session exercise progress type
interface SessionExercise {
  exerciseName: string
  setNumber: number
  completed: boolean
  actualReps?: number
  actualWeight?: number
}

// Custom session that matches the displayed exercises (API or local plan)
const activeSession = ref<{
  id: string
  date: Date
  dayName: string
  exercises: SessionExercise[]
  completed: boolean
} | null>(null)

const startActiveWorkout = () => {
  const day = currentDay.value
  if (!day) return

  // Create session from the DISPLAYED exercises (API plan if available)
  const exercises: SessionExercise[] = []
  day.exercises.forEach((exercise) => {
    for (let i = 0; i < exercise.sets; i++) {
      exercises.push({
        exerciseName: exercise.name,
        setNumber: i + 1,
        completed: false
      })
    }
  })

  activeSession.value = {
    id: `session-${Date.now()}`,
    date: new Date(),
    dayName: day.name,
    exercises,
    completed: false
  }

  workingSetData.value = {}
  activeWorkoutOpen.value = true
}

const isSetCompleted = (exerciseName: string, setNumber: number) => {
  if (!activeSession.value) return false
  const exercise = activeSession.value.exercises.find(
    e => e.exerciseName === exerciseName && e.setNumber === setNumber
  )
  return exercise?.completed || false
}

const completeSetInWorkout = (exerciseName: string, setNumber: number, fallbackReps?: string, fallbackWeight?: number) => {
  if (!activeSession.value) return

  // Initialize working set data if not present (user didn't modify inputs)
  if (fallbackReps !== undefined && fallbackWeight !== undefined) {
    initWorkingSetData(exerciseName, setNumber, fallbackWeight, fallbackReps)
  }

  const data = workingSetData.value[exerciseName]?.[setNumber]

  // Use !== undefined to allow 0 as valid weight (bodyweight exercises)
  if (data?.reps !== undefined && data?.reps > 0 && data?.weight !== undefined) {
    // Update the activeSession directly
    const exercise = activeSession.value.exercises.find(
      e => e.exerciseName === exerciseName && e.setNumber === setNumber
    )
    if (exercise) {
      exercise.completed = true
      exercise.actualReps = data.reps
      exercise.actualWeight = data.weight
    }
  }
}

const getSetsCompleted = (exerciseName: string, totalSets: number) => {
  if (!activeSession.value) return 0
  let completed = 0
  for (let i = 1; i <= totalSets; i++) {
    if (isSetCompleted(exerciseName, i)) {
      completed++
    }
  }
  return completed
}

const isFinishingWorkout = ref(false)
const finishWorkout = async () => {
  if (!activeSession.value) return

  const totalSets = activeSession.value.exercises.length
  const completedSets = activeSession.value.exercises.filter(e => e.completed).length

  isFinishingWorkout.value = true

  try {
    // Mark session as completed
    activeSession.value.completed = true

    // Build workout session data for persistence
    const exerciseMap = new Map<string, WorkoutExerciseData>()

    activeSession.value.exercises.forEach((set) => {
      if (!exerciseMap.has(set.exerciseName)) {
        exerciseMap.set(set.exerciseName, {
          exerciseName: set.exerciseName,
          sets: []
        })
      }
      const exercise = exerciseMap.get(set.exerciseName)!
      exercise.sets.push({
        setNumber: set.setNumber,
        reps: set.actualReps || 0,
        weight: set.actualWeight || 0,
        completed: set.completed
      })
    })

    const workoutData: WorkoutSessionData = {
      dayName: activeSession.value.dayName,
      exercises: Array.from(exerciseMap.values()),
      startedAt: activeSession.value.date.toISOString(),
      finishedAt: new Date().toISOString()
    }

    // Mark workout as completed in progress log with session data
    const result = await progressLogs.markWorkoutCompleted(true, workoutData)

    if (!result || !result.success) {
      const errorMsg = result?.error || 'Unknown error saving workout'
      console.error('Failed to save workout:', errorMsg)
      toast.add({
        title: 'Failed to Save Workout',
        description: errorMsg,
        color: 'error'
      })
      return
    }

    // Refresh logs to update workout history display
    await progressLogs.fetchLogs()

    toast.add({
      title: 'Workout Complete',
      description: `Great work! You completed ${completedSets} of ${totalSets} sets.`,
      color: 'success'
    })
  } catch (err) {
    console.error('Workout save error:', err)
    toast.add({
      title: 'Error',
      description: 'Failed to save workout. Please try again.',
      color: 'error'
    })
  } finally {
    isFinishingWorkout.value = false
    activeWorkoutOpen.value = false
    activeSession.value = null
    workingSetData.value = {}
  }
}

const cancelActiveWorkout = () => {
  activeWorkoutOpen.value = false
  activeSession.value = null
  workingSetData.value = {}
}

const initWorkingSetData = (exerciseName: string, setNumber: number, targetWeight: number, reps: string) => {
  if (!workingSetData.value[exerciseName]) {
    workingSetData.value[exerciseName] = {}
  }
  if (!workingSetData.value[exerciseName][setNumber]) {
    const repParts = reps.split('-')
    const targetReps = parseInt(repParts[0] || '0') || parseInt(reps) || 0
    workingSetData.value[exerciseName][setNumber] = {
      reps: targetReps,
      weight: targetWeight
    }
  }
}

// View workout details modal
const viewWorkoutDetailsOpen = ref(false)

// Get saved workout data for today
const todayWorkoutData = computed(() => {
  return progressLogs.getTodayWorkoutData.value
})

// Resume editing a completed workout
const resumeCompletedWorkout = () => {
  const workoutData = todayWorkoutData.value
  const day = currentDay.value
  if (!workoutData || !day) {
    // Just start fresh if no data
    startActiveWorkout()
    return
  }

  // Rebuild active session from saved data
  const exercises: SessionExercise[] = []
  day.exercises.forEach((exercise) => {
    const savedExercise = workoutData.exercises.find(e => e.exerciseName === exercise.name)
    for (let i = 0; i < exercise.sets; i++) {
      const savedSet = savedExercise?.sets.find(s => s.setNumber === i + 1)
      exercises.push({
        exerciseName: exercise.name,
        setNumber: i + 1,
        completed: savedSet?.completed || false,
        actualReps: savedSet?.reps,
        actualWeight: savedSet?.weight
      })
    }
  })

  activeSession.value = {
    id: `session-${Date.now()}`,
    date: workoutData.startedAt ? new Date(workoutData.startedAt) : new Date(),
    dayName: workoutData.dayName,
    exercises,
    completed: false
  }

  // Restore working set data
  workingSetData.value = {}
  workoutData.exercises.forEach((exercise) => {
    const exerciseData: { [setNum: number]: { reps: number, weight: number } } = {}
    exercise.sets.forEach((set) => {
      exerciseData[set.setNumber] = {
        reps: set.reps,
        weight: set.weight
      }
    })
    workingSetData.value[exercise.exerciseName] = exerciseData
  })

  activeWorkoutOpen.value = true
}

// Add exercise modal
const addExerciseOpen = ref(false)
const newExerciseData = ref({
  name: '',
  sets: 3,
  reps: '8-10',
  targetWeight: 0,
  videoUrl: '',
  instructions: ''
})

const openAddExercise = () => {
  newExerciseData.value = {
    name: '',
    sets: 3,
    reps: '8-10',
    targetWeight: 0,
    videoUrl: '',
    instructions: ''
  }
  addExerciseOpen.value = true
}

const isSavingNewExercise = ref(false)
const saveNewExercise = async () => {
  if (!newExerciseData.value.name) {
    toast.add({
      title: 'Error',
      description: 'Please select an exercise',
      color: 'error'
    })
    return
  }

  isSavingNewExercise.value = true

  try {
    // Add to local state
    addLocalExercise(selectedDayIndex.value, {
      name: newExerciseData.value.name,
      sets: newExerciseData.value.sets,
      reps: newExerciseData.value.reps,
      targetWeight: newExerciseData.value.targetWeight,
      videoUrl: newExerciseData.value.videoUrl || undefined,
      instructions: newExerciseData.value.instructions || undefined
    })

    // Note: API sync for exercises is disabled until the database is seeded with exercise data.
    // Local exercise IDs don't match database exercise IDs, causing FK constraint violations.
    // The plan structure is saved via API, but exercises are managed locally for now.

    toast.add({
      title: 'Exercise Added',
      description: `${newExerciseData.value.name} added to ${currentDay.value?.name || 'workout'}`,
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Warning',
      description: 'Exercise added locally but failed to sync with server',
      color: 'warning'
    })
  } finally {
    isSavingNewExercise.value = false
    addExerciseOpen.value = false
  }
}

const exerciseOptions = computed(() => {
  return exerciseLibrary.map(ex => ({
    label: ex.name,
    value: ex.name,
    description: `${ex.primaryMuscle} • ${ex.equipment}`
  }))
})

const selectedExerciseFromLibrary = computed(() => {
  if (!newExerciseData.value.name) return null
  return exerciseLibrary.find(ex => ex.name === newExerciseData.value.name)
})

const autoFillFromLibrary = () => {
  const exercise = selectedExerciseFromLibrary.value
  if (exercise) {
    if (exercise.youtubeId) {
      newExerciseData.value.videoUrl = `https://youtube.com/watch?v=${exercise.youtubeId}`
    }
    if (exercise.instructions) {
      newExerciseData.value.instructions = exercise.instructions
    }
  }
}

const isCreatingPlan = ref(false)
const handleCreatePlan = async () => {
  if (!newPlanType.value) return

  isCreatingPlan.value = true

  try {
    // Create local plan first
    createLocalPlan(newPlanType.value as 'ppl' | 'upper_lower' | 'full_body' | 'bro_split')

    // Also save to API if authenticated
    if (isAuthenticated.value) {
      const splitInfo = splitTypes.find(s => s.value === newPlanType.value)
      const localCreatedPlan = localPlan.value

      // Create workout plan without exercises (exercises use local IDs that don't exist in DB)
      // The local plan has full exercise data - API sync stores plan metadata only
      await workoutPlansApi.createPlan({
        name: localCreatedPlan.name,
        splitType: newPlanType.value as 'ppl' | 'upper_lower' | 'full_body' | 'bro_split',
        daysPerWeek: splitInfo?.days || 4,
        goal: 'maintain',
        workouts: localCreatedPlan.days.map((day, idx) => ({
          dayName: day.name,
          dayOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][idx % 7] as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
          exercises: [] // Exercises managed locally until DB is seeded with exercise data
        }))
      })
    }

    toast.add({
      title: 'Workout Plan Created',
      description: `Your ${splitTypes.find(s => s.value === newPlanType.value)?.label} plan is ready!`,
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Warning',
      description: 'Plan created locally but failed to sync with server',
      color: 'warning'
    })
  } finally {
    isCreatingPlan.value = false
    createNewPlanOpen.value = false
    newPlanType.value = null
    selectedDayIndex.value = 0
  }
}

// Initialize API data on mount
onMounted(async () => {
  // Initialize local workout data from localStorage
  initWorkouts()

  // Initialize auth to fetch user from token
  await initAuth()

  if (isAuthenticated.value) {
    await Promise.all([
      progressLogs.init(),
      workoutPlansApi.init()
    ])
  }
})

// Watch for auth changes
watch(isAuthenticated, async (authenticated) => {
  if (authenticated) {
    await Promise.all([
      progressLogs.init(),
      workoutPlansApi.init()
    ])
  }
})
</script>

<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="Workouts">
      <template #leading>
        <UDashboardSidebarToggle />
      </template>

      <template #right>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 text-sm">
            <USwitch v-model="boringMode" size="sm" />
            <span class="text-muted hidden sm:inline">{{ boringMode ? 'BORING' : 'Effective' }}</span>
          </div>
          <UButton icon="i-lucide-plus" size="sm" @click="createNewPlanOpen = true">
            New Plan
          </UButton>
        </div>
      </template>
    </UDashboardNavbar>

    <UDashboardPanelContent class="px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Weekly Progress Hero -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/10 border border-primary/20 p-6">
          <!-- Decorative elements -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div class="relative">
            <!-- Header row -->
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-xl font-bold tracking-tight">
                  This Week
                </h2>
                <p class="text-sm text-muted mt-0.5">
                  {{ currentPlan.name }}
                </p>
              </div>
              <div class="text-right">
                <div class="text-3xl font-black text-primary tabular-nums">
                  {{ progressLogs.workoutsThisWeek.value }}<span class="text-lg text-muted font-normal">/{{ currentPlan.daysPerWeek }}</span>
                </div>
                <p class="text-xs text-muted uppercase tracking-wider">
                  Workouts Done
                </p>
              </div>
            </div>

            <!-- Weekly day indicators -->
            <div class="flex items-center justify-between gap-2">
              <button
                v-for="(day, index) in currentPlan.days"
                :key="day.name"
                type="button"
                class="group flex-1 min-w-0"
                @click="selectedDayIndex = index"
              >
                <div
                  class="relative flex flex-col items-center p-3 rounded-xl transition-all duration-200"
                  :class="[
                    selectedDayIndex === index
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                      : 'hover:bg-muted/50'
                  ]"
                >
                  <!-- Day abbreviation -->
                  <span
                    class="text-[10px] font-bold uppercase tracking-wider mb-1.5"
                    :class="selectedDayIndex === index ? 'text-primary-foreground/80' : 'text-muted'"
                  >
                    {{ day.name.slice(0, 3) }}
                  </span>

                  <!-- Status indicator -->
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                    :class="[
                      selectedDayIndex === index
                        ? 'bg-primary-foreground/20'
                        : index < (progressLogs.workoutsThisWeek.value || 0)
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted/30'
                    ]"
                  >
                    <UIcon
                      v-if="index < (progressLogs.workoutsThisWeek.value || 0)"
                      name="i-lucide-check"
                      class="w-4 h-4"
                      :class="selectedDayIndex === index ? 'text-primary-foreground' : 'text-primary'"
                    />
                    <span
                      v-else
                      class="text-xs font-semibold"
                      :class="selectedDayIndex === index ? 'text-primary-foreground' : 'text-muted'"
                    >
                      {{ index + 1 }}
                    </span>
                  </div>

                  <!-- Active indicator dot -->
                  <div
                    v-if="selectedDayIndex === index"
                    class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-foreground"
                  />
                </div>
              </button>
            </div>

            <!-- Workout History List -->
            <div class="mt-5 pt-5 border-t border-primary/10">
              <div class="flex items-center gap-2 mb-3">
                <UIcon name="i-lucide-history" class="w-4 h-4 text-muted" />
                <span class="text-xs font-semibold uppercase tracking-wider text-muted">Recent Workouts</span>
              </div>
              <div v-if="progressLogs.workoutHistoryThisWeek.value.length > 0" class="space-y-2">
                <div
                  v-for="workout in progressLogs.workoutHistoryThisWeek.value.slice(0, 5)"
                  :key="workout.id"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  <div class="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-success" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-sm truncate">
                      {{ workout.dayName }}
                    </div>
                    <div class="text-xs text-muted">
                      {{ workout.exerciseCount }} exercises · {{ workout.totalSets }} sets
                    </div>
                  </div>
                  <div class="text-xs text-muted flex-shrink-0">
                    {{ workout.date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) }}
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4 text-sm text-muted">
                <UIcon name="i-lucide-calendar-x" class="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>
                  No workouts completed this week
                </p>
                <p class="text-xs mt-1">
                  Start a workout to track your progress
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Today's Workout Status Card -->
        <div
          class="rounded-2xl border-2 transition-colors p-5"
          :class="isTodayWorkoutCompleted
            ? 'bg-success/5 border-success/30'
            : 'bg-elevated border-default'"
        >
          <div class="flex items-center gap-4">
            <!-- Status icon -->
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              :class="isTodayWorkoutCompleted ? 'bg-success/20' : 'bg-primary/10'"
            >
              <UIcon
                :name="isTodayWorkoutCompleted ? 'i-lucide-trophy' : 'i-lucide-dumbbell'"
                class="w-7 h-7"
                :class="isTodayWorkoutCompleted ? 'text-success' : 'text-primary'"
              />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <h3 class="font-bold text-lg truncate">
                  {{ currentDay?.name || 'Rest Day' }}
                </h3>
                <UBadge
                  v-if="isTodayWorkoutCompleted"
                  color="success"
                  variant="subtle"
                  size="xs"
                >
                  Done
                </UBadge>
              </div>
              <p class="text-sm text-muted">
                <span v-if="currentDay">
                  {{ currentDay.exercises.length }} exercises · {{ getTotalSets(currentDay.exercises) }} sets
                </span>
                <span v-else>No workout scheduled</span>
              </p>
            </div>

            <!-- Action -->
            <div class="flex-shrink-0 flex items-center gap-2">
              <UButton
                v-if="currentDay && !isTodayWorkoutCompleted"
                size="lg"
                class="font-semibold px-6"
                @click="startActiveWorkout"
              >
                <UIcon name="i-lucide-play" class="w-4 h-4 mr-1.5" />
                Start
              </UButton>
              <template v-else-if="isTodayWorkoutCompleted">
                <UButton
                  variant="soft"
                  color="neutral"
                  size="lg"
                  @click="viewWorkoutDetailsOpen = true"
                >
                  <UIcon name="i-lucide-eye" class="w-4 h-4 mr-1.5" />
                  View
                </UButton>
                <UButton
                  variant="soft"
                  color="success"
                  size="lg"
                  @click="resumeCompletedWorkout"
                >
                  <UIcon name="i-lucide-pencil" class="w-4 h-4 mr-1.5" />
                  Edit
                </UButton>
              </template>
            </div>
          </div>
        </div>

        <!-- Exercise List -->
        <div v-if="currentDay" class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold uppercase tracking-wider text-muted">
              Exercises
            </h3>
            <UButton
              variant="ghost"
              color="neutral"
              size="xs"
              icon="i-lucide-plus"
              @click="openAddExercise"
            >
              Add
            </UButton>
          </div>

          <div class="space-y-2">
            <div
              v-for="(exercise, exIndex) in currentDay.exercises"
              :key="exercise.name"
              class="group rounded-xl bg-elevated border border-default overflow-hidden hover:border-muted transition-colors"
            >
              <div class="p-4">
                <div class="flex items-center gap-4">
                  <!-- Exercise number -->
                  <div class="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center flex-shrink-0">
                    <span class="text-sm font-bold text-muted">{{ exIndex + 1 }}</span>
                  </div>

                  <!-- Exercise info -->
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold truncate">
                      {{ exercise.name }}
                    </div>
                    <div class="flex items-center gap-3 text-sm text-muted mt-0.5">
                      <span class="flex items-center gap-1">
                        <UIcon name="i-lucide-layers" class="w-3.5 h-3.5" />
                        {{ exercise.sets }} sets
                      </span>
                      <span class="flex items-center gap-1">
                        <UIcon name="i-lucide-repeat" class="w-3.5 h-3.5" />
                        {{ exercise.reps }} reps
                      </span>
                      <span v-if="exercise.targetWeight > 0" class="flex items-center gap-1">
                        <UIcon name="i-lucide-weight" class="w-3.5 h-3.5" />
                        {{ exercise.targetWeight }} lbs
                      </span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-1">
                    <UPopover :content="{ side: 'top', align: 'end' }">
                      <UButton
                        variant="ghost"
                        color="neutral"
                        icon="i-lucide-info"
                        size="xs"
                      />
                      <template #content>
                        <div class="p-3 max-w-xs space-y-2">
                          <div class="font-medium text-sm mb-2">
                            {{ exercise.name }}
                          </div>
                          <div class="text-xs text-muted space-y-1">
                            <p>
                              {{ exercise.sets }} sets × {{ exercise.reps }} reps
                            </p>
                            <p v-if="exercise.targetWeight > 0">
                              Target: {{ exercise.targetWeight }} lbs
                            </p>
                          </div>
                          <p v-if="exercise.instructions" class="text-sm text-muted border-t border-default pt-2 mt-2">
                            {{ exercise.instructions }}
                          </p>
                          <a
                            v-if="exercise.videoUrl"
                            :href="exercise.videoUrl"
                            target="_blank"
                            class="text-sm text-primary hover:underline inline-flex items-center gap-1"
                          >
                            <UIcon name="i-lucide-play-circle" class="w-4 h-4" />
                            Watch Video
                          </a>
                        </div>
                      </template>
                    </UPopover>
                    <UButton
                      variant="ghost"
                      color="neutral"
                      icon="i-lucide-pencil"
                      size="xs"
                      @click="openEditExercise(selectedDayIndex, exIndex)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats Row -->
        <div class="grid grid-cols-3 gap-3">
          <div class="p-4 rounded-xl bg-muted/20 text-center">
            <div class="text-2xl font-black tabular-nums">
              {{ currentPlan.currentWeek }}
            </div>
            <div class="text-xs text-muted uppercase tracking-wider mt-0.5">
              Week
            </div>
          </div>
          <div class="p-4 rounded-xl bg-muted/20 text-center">
            <div class="text-2xl font-black tabular-nums">
              {{ currentPlan.days.reduce((sum, d) => sum + getTotalSets(d.exercises), 0) }}
            </div>
            <div class="text-xs text-muted uppercase tracking-wider mt-0.5">
              Weekly Sets
            </div>
          </div>
          <div class="p-4 rounded-xl bg-muted/20 text-center">
            <div class="text-2xl font-black tabular-nums">
              {{ currentPlan.daysPerWeek }}
            </div>
            <div class="text-xs text-muted uppercase tracking-wider mt-0.5">
              Days/Week
            </div>
          </div>
        </div>
      </div>
    </UDashboardPanelContent>

    <!-- Active Workout Session Modal -->
    <UModal v-model:open="activeWorkoutOpen" :ui="{ content: 'sm:max-w-3xl' }">
      <template #content>
        <UCard v-if="activeSession && currentDay">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">
                  {{ currentDay.name }} Workout
                </h3>
                <p class="text-sm text-muted">
                  {{ currentDay.focus }}
                </p>
              </div>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="cancelActiveWorkout"
              />
            </div>
          </template>

          <div class="space-y-4 max-h-[60vh] overflow-y-auto">
            <div
              v-for="exercise in currentDay.exercises"
              :key="exercise.name"
              class="p-4 rounded-xl bg-elevated border border-default"
            >
              <div class="flex items-center justify-between mb-3">
                <div>
                  <div class="font-medium">
                    {{ exercise.name }}
                  </div>
                  <div class="text-sm text-muted">
                    {{ getSetsCompleted(exercise.name, exercise.sets) }} of {{ exercise.sets }} sets completed
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <div
                  v-for="setNum in exercise.sets"
                  :key="setNum"
                  class="flex items-center gap-2 p-2 rounded-lg"
                  :class="isSetCompleted(exercise.name, setNum) ? 'bg-success/10' : 'bg-muted/20'"
                >
                  <div class="text-sm font-medium w-16">
                    Set {{ setNum }}
                  </div>
                  <UInput
                    :model-value="workingSetData[exercise.name]?.[setNum]?.reps ?? parseInt(exercise.reps.split('-')[0] || exercise.reps || '0')"
                    type="number"
                    placeholder="Reps"
                    class="w-20"
                    size="sm"
                    :disabled="isSetCompleted(exercise.name, setNum)"
                    @update:model-value="(val) => { initWorkingSetData(exercise.name, setNum, exercise.targetWeight, exercise.reps); const setData = workingSetData[exercise.name]?.[setNum]; if (setData) setData.reps = Number(val) }"
                    @focus="initWorkingSetData(exercise.name, setNum, exercise.targetWeight, exercise.reps)"
                  />
                  <span class="text-sm text-muted">reps @</span>
                  <UInput
                    :model-value="workingSetData[exercise.name]?.[setNum]?.weight ?? exercise.targetWeight"
                    type="number"
                    placeholder="Weight"
                    class="w-24"
                    size="sm"
                    :disabled="isSetCompleted(exercise.name, setNum)"
                    @update:model-value="(val) => { initWorkingSetData(exercise.name, setNum, exercise.targetWeight, exercise.reps); const setData = workingSetData[exercise.name]?.[setNum]; if (setData) setData.weight = Number(val) }"
                    @focus="initWorkingSetData(exercise.name, setNum, exercise.targetWeight, exercise.reps)"
                  />
                  <span class="text-sm text-muted">lbs</span>
                  <UButton
                    v-if="!isSetCompleted(exercise.name, setNum)"
                    size="sm"
                    @click="completeSetInWorkout(exercise.name, setNum, exercise.reps, exercise.targetWeight)"
                  >
                    Complete
                  </UButton>
                  <UIcon
                    v-else
                    name="i-lucide-check-circle"
                    class="w-5 h-5 text-success ml-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" color="neutral" @click="cancelActiveWorkout">
                Cancel Workout
              </UButton>
              <UButton :loading="isFinishingWorkout" @click="finishWorkout">
                Finish Workout
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Create New Plan Modal -->
    <UModal v-model:open="createNewPlanOpen">
      <template #content>
        <UCard class="sm:min-w-[450px]">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">
                  Create Workout Plan
                </h3>
                <p class="text-sm text-muted">
                  Choose a split type to get started
                </p>
              </div>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="createNewPlanOpen = false"
              />
            </div>
          </template>

          <div class="space-y-3 max-h-[60vh] overflow-y-auto">
            <button
              v-for="split in splitTypes"
              :key="split.value"
              type="button"
              class="w-full p-4 rounded-xl text-left transition-colors"
              :class="newPlanType === split.value
                ? 'bg-primary/10 border-2 border-primary'
                : 'bg-elevated border border-default hover:border-muted'"
              @click="newPlanType = split.value"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium">
                    {{ split.label }}
                  </div>
                  <div class="text-sm text-muted">
                    {{ split.description }}
                  </div>
                </div>
                <UBadge color="neutral" variant="subtle">
                  {{ split.days }} days
                </UBadge>
              </div>
            </button>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" color="neutral" @click="createNewPlanOpen = false">
                Cancel
              </UButton>
              <UButton :disabled="!newPlanType" :loading="isCreatingPlan" @click="handleCreatePlan">
                Create Plan
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Edit Exercise Modal -->
    <UModal v-model:open="editExerciseOpen">
      <template #content>
        <UCard v-if="getExerciseToEdit" class="sm:min-w-[400px]">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">
                  Edit Exercise
                </h3>
                <p class="text-sm text-muted">
                  {{ getExerciseToEdit.name }}
                </p>
              </div>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="editExerciseOpen = false"
              />
            </div>
          </template>

          <div class="space-y-4 max-h-[60vh] overflow-y-auto">
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Sets">
                <UInput
                  v-model.number="editingExerciseData.sets"
                  type="number"
                  min="1"
                  max="10"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Reps">
                <UInput v-model="editingExerciseData.reps" placeholder="e.g., 8-10" class="w-full" />
              </UFormField>
            </div>

            <UFormField label="Target Weight (lbs)">
              <UInput
                v-model.number="editingExerciseData.targetWeight"
                type="number"
                min="0"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Video URL (optional)">
              <UInput
                v-model="editingExerciseData.videoUrl"
                placeholder="https://youtube.com/..."
                class="w-full"
              />
            </UFormField>

            <UFormField label="Instructions (optional)">
              <UTextarea
                v-model="editingExerciseData.instructions"
                placeholder="Form cues, tips, etc."
                :rows="3"
                class="w-full"
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" color="neutral" @click="editExerciseOpen = false">
                Cancel
              </UButton>
              <UButton :loading="isSavingExercise" @click="saveExercise">
                Save Changes
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Add Exercise Modal -->
    <UModal v-model:open="addExerciseOpen">
      <template #content>
        <UCard class="sm:min-w-[500px]">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">
                  Add Exercise
                </h3>
                <p class="text-sm text-muted">
                  Add to {{ currentDay?.name }}
                </p>
              </div>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="addExerciseOpen = false"
              />
            </div>
          </template>

          <div class="space-y-4 max-h-[60vh] overflow-y-auto">
            <UFormField label="Exercise">
              <USelect
                v-model="newExerciseData.name"
                :items="exerciseOptions"
                placeholder="Select an exercise"
                searchable
                class="w-full"
                @update:model-value="autoFillFromLibrary"
              />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Sets">
                <UInput
                  v-model.number="newExerciseData.sets"
                  type="number"
                  min="1"
                  max="10"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Reps">
                <UInput
                  v-model="newExerciseData.reps"
                  placeholder="e.g., 8-10"
                  class="w-full"
                />
              </UFormField>
            </div>

            <UFormField label="Target Weight (lbs)">
              <UInput
                v-model.number="newExerciseData.targetWeight"
                type="number"
                min="0"
                placeholder="0 for bodyweight"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Video URL (optional)">
              <UInput
                v-model="newExerciseData.videoUrl"
                placeholder="https://youtube.com/..."
                class="w-full"
              />
            </UFormField>

            <UFormField label="Instructions (optional)">
              <UTextarea
                v-model="newExerciseData.instructions"
                placeholder="Form cues, tips, etc."
                :rows="3"
                class="w-full"
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" color="neutral" @click="addExerciseOpen = false">
                Cancel
              </UButton>
              <UButton :loading="isSavingNewExercise" @click="saveNewExercise">
                Add Exercise
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- View Workout Details Modal -->
    <UModal v-model:open="viewWorkoutDetailsOpen" :ui="{ content: 'sm:max-w-2xl' }">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">
                  Today's Workout Summary
                </h3>
                <p v-if="todayWorkoutData" class="text-sm text-muted">
                  {{ todayWorkoutData.dayName }} · Completed {{ todayWorkoutData.finishedAt ? new Date(todayWorkoutData.finishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'today' }}
                </p>
              </div>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="viewWorkoutDetailsOpen = false"
              />
            </div>
          </template>

          <div v-if="todayWorkoutData" class="space-y-4 max-h-[60vh] overflow-y-auto">
            <div
              v-for="exercise in todayWorkoutData.exercises"
              :key="exercise.exerciseName"
              class="p-4 rounded-xl bg-elevated border border-default"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="font-medium">
                  {{ exercise.exerciseName }}
                </div>
                <UBadge
                  :color="exercise.sets.filter(s => s.completed).length === exercise.sets.length ? 'success' : 'warning'"
                  variant="subtle"
                  size="sm"
                >
                  {{ exercise.sets.filter(s => s.completed).length }}/{{ exercise.sets.length }} sets
                </UBadge>
              </div>

              <div class="space-y-1.5">
                <div
                  v-for="set in exercise.sets"
                  :key="set.setNumber"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
                  :class="set.completed ? 'bg-success/10' : 'bg-muted/20'"
                >
                  <span class="font-medium text-muted w-14">Set {{ set.setNumber }}</span>
                  <span v-if="set.completed" class="flex items-center gap-2">
                    <span class="font-semibold">{{ set.reps }}</span>
                    <span class="text-muted">reps</span>
                    <span class="text-muted">@</span>
                    <span class="font-semibold">{{ set.weight }}</span>
                    <span class="text-muted">lbs</span>
                  </span>
                  <span v-else class="text-muted italic">Not completed</span>
                  <UIcon
                    v-if="set.completed"
                    name="i-lucide-check-circle"
                    class="w-4 h-4 text-success ml-auto"
                  />
                </div>
              </div>
            </div>

            <div v-if="todayWorkoutData.notes" class="p-4 rounded-xl bg-muted/10 border border-muted">
              <div class="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                Notes
              </div>
              <p class="text-sm">
                {{ todayWorkoutData.notes }}
              </p>
            </div>
          </div>

          <div v-else class="py-8 text-center text-muted">
            <UIcon name="i-lucide-file-x" class="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No workout data saved for today.</p>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" color="neutral" @click="viewWorkoutDetailsOpen = false">
                Close
              </UButton>
              <UButton @click="viewWorkoutDetailsOpen = false; resumeCompletedWorkout()">
                <UIcon name="i-lucide-pencil" class="w-4 h-4 mr-1.5" />
                Edit Workout
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </UDashboardPanel>
</template>
