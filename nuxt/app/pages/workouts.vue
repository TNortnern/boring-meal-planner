<script setup lang="ts">
const toast = useToast()

const {
  boringMode,
  currentPlan,
  currentSession,
  workoutStats,
  startWorkout,
  completeSet,
  endWorkout,
  cancelWorkout,
  updateExerciseTarget,
  addExercise,
  createWorkoutPlan
} = useWorkouts()

const { exercises: exerciseLibrary } = useExerciseData()

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

const saveExercise = () => {
  if (!editingExercise.value) return
  updateExerciseTarget(
    editingExercise.value.dayIndex,
    editingExercise.value.exerciseIndex,
    editingExerciseData.value
  )
  editExerciseOpen.value = false
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

const startActiveWorkout = () => {
  startWorkout(selectedDayIndex.value)
  workingSetData.value = {}
  activeWorkoutOpen.value = true
}

const isSetCompleted = (exerciseName: string, setNumber: number) => {
  if (!currentSession.value) return false
  const exercise = currentSession.value.exercises.find(
    e => e.exerciseName === exerciseName && e.setNumber === setNumber
  )
  return exercise?.completed || false
}

const completeSetInWorkout = (exerciseName: string, setNumber: number) => {
  const data = workingSetData.value[exerciseName]?.[setNumber]

  if (data?.reps && data?.weight) {
    completeSet(exerciseName, setNumber, data.reps, data.weight)
  }
}

const getSetsCompleted = (exerciseName: string, totalSets: number) => {
  if (!currentSession.value) return 0
  let completed = 0
  for (let i = 1; i <= totalSets; i++) {
    if (isSetCompleted(exerciseName, i)) {
      completed++
    }
  }
  return completed
}

const finishWorkout = () => {
  if (!currentSession.value) return

  const totalSets = currentSession.value.exercises.length
  const completedSets = currentSession.value.exercises.filter(e => e.completed).length

  endWorkout()
  activeWorkoutOpen.value = false
  workingSetData.value = {}

  toast.add({
    title: 'Workout Complete',
    description: `Great work! You completed ${completedSets} of ${totalSets} sets.`,
    color: 'success'
  })
}

const cancelActiveWorkout = () => {
  cancelWorkout()
  activeWorkoutOpen.value = false
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

const expandedExercise = ref<string | null>(null)

const toggleExerciseExpanded = (exerciseName: string) => {
  if (expandedExercise.value === exerciseName) {
    expandedExercise.value = null
  } else {
    expandedExercise.value = exerciseName
  }
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

const saveNewExercise = () => {
  if (!newExerciseData.value.name) {
    toast.add({
      title: 'Error',
      description: 'Please select an exercise',
      color: 'error'
    })
    return
  }

  addExercise(selectedDayIndex.value, {
    name: newExerciseData.value.name,
    sets: newExerciseData.value.sets,
    reps: newExerciseData.value.reps,
    targetWeight: newExerciseData.value.targetWeight,
    videoUrl: newExerciseData.value.videoUrl || undefined,
    instructions: newExerciseData.value.instructions || undefined
  })

  toast.add({
    title: 'Exercise Added',
    description: `${newExerciseData.value.name} added to ${currentDay.value?.name || 'workout'}`,
    color: 'success'
  })

  addExerciseOpen.value = false
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

const handleCreatePlan = () => {
  if (!newPlanType.value) return

  createWorkoutPlan(newPlanType.value as 'ppl' | 'upper_lower' | 'full_body' | 'bro_split')

  toast.add({
    title: 'Workout Plan Created',
    description: `Your ${splitTypes.find(s => s.value === newPlanType.value)?.label} plan is ready!`,
    color: 'success'
  })

  createNewPlanOpen.value = false
  newPlanType.value = null
  selectedDayIndex.value = 0
}
</script>

<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="Workouts">
      <template #leading>
        <UDashboardSidebarToggle />
      </template>

      <template #right>
        <UButton icon="i-lucide-plus" @click="createNewPlanOpen = true">
          New Plan
        </UButton>
      </template>
    </UDashboardNavbar>

    <UDashboardPanelContent class="px-4 sm:px-6 lg:px-8">
      <div class="space-y-6">
        <!-- Current Plan Header -->
        <div class="p-4 rounded-xl bg-elevated border border-default">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h2 class="text-lg font-semibold">
                {{ currentPlan.name }}
              </h2>
              <p class="text-sm text-muted">
                {{ splitTypes.find(s => s.value === currentPlan.type)?.label }} ·
                {{ currentPlan.daysPerWeek }} days/week · Week {{ currentPlan.currentWeek }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <UToggle v-model="boringMode" />
              <span class="text-sm">{{ boringMode ? 'BORING Mode' : 'Effective Mode' }}</span>
            </div>
          </div>

          <!-- Day tabs -->
          <div class="flex gap-2 overflow-x-auto pb-2">
            <button
              v-for="(day, index) in currentPlan.days"
              :key="day.name"
              type="button"
              class="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="selectedDayIndex === index
                ? 'bg-primary text-white'
                : 'bg-muted/30 hover:bg-muted/50'"
              @click="selectedDayIndex = index"
            >
              {{ day.name }}
            </button>
          </div>
        </div>

        <!-- Selected Day Detail -->
        <div v-if="currentDay" class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-semibold">
                {{ currentDay.name }}
              </h3>
              <p class="text-sm text-muted">
                {{ currentDay.focus }}
              </p>
            </div>
            <div class="flex items-center gap-4 text-sm">
              <div>
                <span class="font-medium">{{ currentDay.exercises.length }}</span>
                <span class="text-muted"> exercises</span>
              </div>
              <div>
                <span class="font-medium">{{ getTotalSets(currentDay.exercises) }}</span>
                <span class="text-muted"> total sets</span>
              </div>
              <UButton @click="startActiveWorkout">
                Start Workout
              </UButton>
            </div>
          </div>

          <!-- Exercise List -->
          <div class="space-y-2">
            <div
              v-for="(exercise, exIndex) in currentDay.exercises"
              :key="exercise.name"
              class="rounded-xl bg-elevated border border-default overflow-hidden"
            >
              <div class="p-4">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="font-medium">
                      {{ exercise.name }}
                    </div>
                    <div class="text-sm text-muted mt-1">
                      {{ exercise.sets }} sets × {{ exercise.reps }} reps
                      <span v-if="exercise.targetWeight > 0"> @ {{ exercise.targetWeight }} lbs</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <UButton
                      variant="ghost"
                      color="neutral"
                      :icon="expandedExercise === exercise.name ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                      size="sm"
                      @click="toggleExerciseExpanded(exercise.name)"
                    />
                    <UButton
                      variant="ghost"
                      color="neutral"
                      icon="i-lucide-pencil"
                      size="sm"
                      @click="openEditExercise(selectedDayIndex, exIndex)"
                    />
                  </div>
                </div>
              </div>

              <!-- Expanded exercise details -->
              <div v-if="expandedExercise === exercise.name" class="px-4 pb-4 pt-2 border-t border-default">
                <div v-if="exercise.instructions" class="mb-3">
                  <div class="text-sm font-medium mb-1">
                    Instructions
                  </div>
                  <p class="text-sm text-muted">
                    {{ exercise.instructions }}
                  </p>
                </div>
                <div v-if="exercise.videoUrl" class="mb-3">
                  <div class="text-sm font-medium mb-1">
                    Video
                  </div>
                  <a :href="exercise.videoUrl" target="_blank" class="text-sm text-primary hover:underline">
                    Watch exercise video
                  </a>
                </div>
                <div v-if="!exercise.instructions && !exercise.videoUrl" class="text-sm text-muted">
                  No additional details available. Click edit to add instructions or video URL.
                </div>
              </div>
            </div>
          </div>

          <!-- Add Exercise Button -->
          <UButton
            variant="outline"
            color="neutral"
            block
            icon="i-lucide-plus"
            @click="openAddExercise"
          >
            Add Exercise
          </UButton>
        </div>

        <!-- Quick Stats -->
        <div class="grid gap-4 md:grid-cols-3">
          <div class="p-4 rounded-xl bg-elevated border border-default">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-primary/10">
                <UIcon name="i-lucide-calendar" class="w-5 h-5 text-primary" />
              </div>
              <div>
                <div class="text-2xl font-bold">
                  {{ currentPlan.currentWeek }}
                </div>
                <div class="text-sm text-muted">
                  Weeks on plan
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-elevated border border-default">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-primary/10">
                <UIcon name="i-lucide-dumbbell" class="w-5 h-5 text-primary" />
              </div>
              <div>
                <div class="text-2xl font-bold">
                  {{ workoutStats.thisWeek }}
                </div>
                <div class="text-sm text-muted">
                  Workouts this week
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-elevated border border-default">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-primary/10">
                <UIcon name="i-lucide-layers" class="w-5 h-5 text-primary" />
              </div>
              <div>
                <div class="text-2xl font-bold">
                  {{ currentPlan.days.reduce((sum, d) => sum + getTotalSets(d.exercises), 0) }}
                </div>
                <div class="text-sm text-muted">
                  Weekly sets
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- BORING Mode indicator -->
        <div class="flex items-center justify-center gap-2 py-3 text-sm text-muted">
          <UIcon name="i-lucide-lock" class="w-4 h-4" />
          <span v-if="boringMode">BORING Mode — Same workouts, progressive overload</span>
          <span v-else>Effective Mode — Varied programming for optimal results</span>
        </div>
      </div>
    </UDashboardPanelContent>

    <!-- Active Workout Session Modal -->
    <UModal v-model:open="activeWorkoutOpen" :ui="{ content: 'sm:max-w-3xl' }">
      <template #content>
        <UCard v-if="currentSession && currentDay">
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
                    @click="completeSetInWorkout(exercise.name, setNum)"
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
              <UButton @click="finishWorkout">
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
              <UButton :disabled="!newPlanType" @click="handleCreatePlan">
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
              <UButton @click="saveExercise">
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
              <UButton @click="saveNewExercise">
                Add Exercise
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </UDashboardPanel>
</template>
