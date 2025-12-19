<script setup lang="ts">
import { exercises } from '~/data/exercises'
import type { Exercise } from '~/data/exercises'

const search = ref('')
const selectedMuscle = ref<string | undefined>(undefined)
const selectedEquipment = ref<string | undefined>(undefined)
const selectedJointFriendly = ref<boolean | undefined>(undefined)
const selectedDifficulty = ref<string | undefined>(undefined)
const sortBy = ref<'effectiveness' | 'difficulty' | 'name'>('effectiveness')
const showVideoModal = ref(false)
const videoUrl = ref('')
const showWorkoutDayModal = ref(false)
const exerciseToAdd = ref<Exercise | null>(null)
const selectedWorkoutDay = ref<number | null>(null)

const toast = useToast()
const { currentPlan } = useWorkouts()

const muscleGroups = [
  { value: 'chest', label: 'Chest', icon: 'i-lucide-square' },
  { value: 'back', label: 'Back', icon: 'i-lucide-rows-3' },
  { value: 'shoulders', label: 'Shoulders', icon: 'i-lucide-move-horizontal' },
  { value: 'biceps', label: 'Biceps', icon: 'i-lucide-circle' },
  { value: 'triceps', label: 'Triceps', icon: 'i-lucide-triangle' },
  { value: 'quads', label: 'Quads', icon: 'i-lucide-arrow-up' },
  { value: 'hamstrings', label: 'Hamstrings', icon: 'i-lucide-arrow-down' },
  { value: 'glutes', label: 'Glutes', icon: 'i-lucide-circle-dot' },
  { value: 'calves', label: 'Calves', icon: 'i-lucide-chevrons-down' },
  { value: 'core', label: 'Core', icon: 'i-lucide-align-center' }
]

const equipmentOptions = [
  { value: 'barbell', label: 'Barbell' },
  { value: 'dumbbell', label: 'Dumbbell' },
  { value: 'cable', label: 'Cable' },
  { value: 'machine', label: 'Machine' },
  { value: 'bodyweight', label: 'Bodyweight' },
  { value: 'bands', label: 'Bands' }
]

const difficultyOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
]

const sortOptions = [
  { value: 'effectiveness', label: 'Effectiveness (Best First)' },
  { value: 'difficulty', label: 'Difficulty' },
  { value: 'name', label: 'Name (A-Z)' }
]

const allExercises = ref<Exercise[]>(exercises)

const filteredAndSortedExercises = computed(() => {
  let filtered = allExercises.value.filter((exercise) => {
    // Search filter
    if (search.value && !exercise.name.toLowerCase().includes(search.value.toLowerCase())) {
      return false
    }
    // Muscle filter
    if (selectedMuscle.value && exercise.primaryMuscle !== selectedMuscle.value) {
      return false
    }
    // Equipment filter
    if (selectedEquipment.value && exercise.equipment !== selectedEquipment.value) {
      return false
    }
    // Joint friendly filter
    if (selectedJointFriendly.value !== undefined && exercise.jointFriendly !== selectedJointFriendly.value) {
      return false
    }
    // Difficulty filter
    if (selectedDifficulty.value && exercise.difficulty !== selectedDifficulty.value) {
      return false
    }
    return true
  })

  // Sort
  if (sortBy.value === 'effectiveness') {
    filtered = filtered.sort((a, b) => b.effectivenessRank - a.effectivenessRank)
  } else if (sortBy.value === 'difficulty') {
    const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 }
    filtered = filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
  } else if (sortBy.value === 'name') {
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  return filtered
})

const clearFilters = () => {
  search.value = ''
  selectedMuscle.value = undefined
  selectedEquipment.value = undefined
  selectedJointFriendly.value = undefined
  selectedDifficulty.value = undefined
}

const selectedExercise = ref<Exercise | null>(null)

const exerciseModalOpen = computed({
  get: () => !!selectedExercise.value,
  set: (value: boolean) => {
    if (!value) selectedExercise.value = null
  }
})

const getMuscleLabel = (value: string) => {
  return muscleGroups.find(m => m.value === value)?.label || value
}

const getEquipmentLabel = (value: string) => {
  return equipmentOptions.find(e => e.value === value)?.label || value
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'success'
    case 'intermediate': return 'warning'
    case 'advanced': return 'error'
    default: return 'neutral'
  }
}

const getEffectivenessStars = (rank: number) => {
  return '★'.repeat(rank) + '☆'.repeat(5 - rank)
}

const openVideo = (youtubeId: string) => {
  videoUrl.value = `https://www.youtube.com/embed/${youtubeId}`
  showVideoModal.value = true
}

const closeVideoModal = () => {
  showVideoModal.value = false
  videoUrl.value = ''
}

const openAddToWorkout = (exercise: Exercise) => {
  exerciseToAdd.value = exercise
  selectedWorkoutDay.value = null
  showWorkoutDayModal.value = true
}

const addExerciseToWorkout = () => {
  if (!exerciseToAdd.value || selectedWorkoutDay.value === null) return

  const day = currentPlan.value.days[selectedWorkoutDay.value]
  if (!day) return

  // Get default sets and reps based on difficulty
  const getDefaultSetsReps = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return { sets: 3, reps: '8-10' }
      case 'intermediate':
        return { sets: 3, reps: '10-12' }
      case 'advanced':
        return { sets: 4, reps: '8-12' }
      default:
        return { sets: 3, reps: '10-12' }
    }
  }

  const { sets, reps } = getDefaultSetsReps(exerciseToAdd.value.difficulty)

  // Add exercise to the workout day
  day.exercises.push({
    name: exerciseToAdd.value.name,
    sets,
    reps,
    targetWeight: 0,
    videoUrl: `https://www.youtube.com/watch?v=${exerciseToAdd.value.youtubeId}`,
    instructions: exerciseToAdd.value.instructions
  })

  // Show success toast
  toast.add({
    title: 'Exercise added',
    description: `${exerciseToAdd.value.name} added to ${day.name}`,
    color: 'success'
  })

  // Close modals
  showWorkoutDayModal.value = false
  selectedExercise.value = null
  exerciseToAdd.value = null
  selectedWorkoutDay.value = null
}

type BenchmarkLevel = 'beginner' | 'intermediate' | 'advanced'
type BenchmarkData = { sets: number, reps: string, weight: string }

const getRepBenchmarks = (exercise: Exercise): Record<BenchmarkLevel, BenchmarkData> => {
  const isBodyweight = exercise.equipment === 'bodyweight'

  // Define benchmarks based on exercise type
  const benchmarks: Record<BenchmarkLevel, BenchmarkData> = {
    beginner: { sets: 3, reps: '8-10', weight: isBodyweight ? 'Bodyweight' : '20-30 lbs' },
    intermediate: { sets: 3, reps: '10-12', weight: isBodyweight ? 'Bodyweight + 10 lbs' : '40-60 lbs' },
    advanced: { sets: 4, reps: '12-15', weight: isBodyweight ? 'Bodyweight + 25 lbs' : '70-100 lbs' }
  }

  // Adjust for compound vs isolation movements
  if (exercise.effectivenessRank >= 4) {
    // Compound movements - heavier weights
    benchmarks.beginner.weight = isBodyweight ? 'Bodyweight' : '40-60 lbs'
    benchmarks.intermediate.weight = isBodyweight ? 'Bodyweight + 20 lbs' : '80-120 lbs'
    benchmarks.advanced.weight = isBodyweight ? 'Bodyweight + 45 lbs' : '140-180 lbs'
  }

  return benchmarks
}
</script>

<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="Exercises">
      <template #leading>
        <UDashboardSidebarToggle />
      </template>

      <template #right>
        <div class="flex items-center gap-3">
          <UInput
            v-model="search"
            placeholder="Search exercises..."
            icon="i-lucide-search"
            class="w-64"
          />
          <UColorModeButton />
        </div>
      </template>
    </UDashboardNavbar>

    <UDashboardPanelContent class="px-4 sm:px-6 lg:px-8">
      <div class="space-y-6">
        <!-- Muscle Group Selector -->
        <div class="p-4 rounded-xl bg-elevated border border-default">
          <label class="text-xs text-muted block mb-3">Target Muscle</label>
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="muscle in muscleGroups"
              :key="muscle.value"
              :variant="selectedMuscle === muscle.value ? 'solid' : 'outline'"
              :color="selectedMuscle === muscle.value ? 'primary' : 'neutral'"
              size="sm"
              @click="selectedMuscle = selectedMuscle === muscle.value ? undefined : muscle.value"
            >
              {{ muscle.label }}
            </UButton>
          </div>
        </div>

        <!-- Additional Filters and Sorting -->
        <div class="flex flex-wrap gap-3 p-4 rounded-xl bg-elevated border border-default">
          <div>
            <label class="text-xs text-muted block mb-1">Sort By</label>
            <USelect
              v-model="sortBy"
              :items="sortOptions"
              value-key="value"
              label-key="label"
              class="w-52"
            />
          </div>

          <div>
            <label class="text-xs text-muted block mb-1">Equipment</label>
            <USelect
              v-model="selectedEquipment"
              :items="equipmentOptions"
              placeholder="Any"
              value-key="value"
              label-key="label"
              class="w-36"
            />
          </div>

          <div>
            <label class="text-xs text-muted block mb-1">Difficulty</label>
            <USelect
              v-model="selectedDifficulty"
              :items="difficultyOptions"
              placeholder="Any"
              value-key="value"
              label-key="label"
              class="w-36"
            />
          </div>

          <div>
            <label class="text-xs text-muted block mb-1">Joint Friendly</label>
            <UButtonGroup>
              <UButton
                :variant="selectedJointFriendly === undefined ? 'solid' : 'outline'"
                :color="selectedJointFriendly === undefined ? 'primary' : 'neutral'"
                size="sm"
                @click="selectedJointFriendly = undefined"
              >
                All
              </UButton>
              <UButton
                :variant="selectedJointFriendly === true ? 'solid' : 'outline'"
                :color="selectedJointFriendly === true ? 'primary' : 'neutral'"
                size="sm"
                @click="selectedJointFriendly = true"
              >
                Yes
              </UButton>
              <UButton
                :variant="selectedJointFriendly === false ? 'solid' : 'outline'"
                :color="selectedJointFriendly === false ? 'primary' : 'neutral'"
                size="sm"
                @click="selectedJointFriendly = false"
              >
                No
              </UButton>
            </UButtonGroup>
          </div>

          <div class="flex items-end ml-auto">
            <UButton
              v-if="search || selectedMuscle || selectedEquipment || selectedJointFriendly !== undefined || selectedDifficulty"
              variant="ghost"
              color="neutral"
              size="sm"
              @click="clearFilters"
            >
              Clear filters
            </UButton>
          </div>
        </div>

        <!-- Results count -->
        <div class="text-sm text-muted">
          {{ filteredAndSortedExercises.length }} exercises found
        </div>

        <!-- Exercise list -->
        <div class="space-y-3">
          <button
            v-for="exercise in filteredAndSortedExercises"
            :key="exercise.id"
            type="button"
            class="w-full p-4 rounded-xl bg-elevated border border-default text-left hover:border-primary transition-colors"
            @click="selectedExercise = exercise"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <h3 class="font-medium">
                    {{ exercise.name }}
                  </h3>
                  <span class="text-amber-500 text-sm" :title="`Effectiveness: ${exercise.effectivenessRank}/5`">
                    {{ getEffectivenessStars(exercise.effectivenessRank) }}
                  </span>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <UBadge color="primary" variant="subtle" size="xs">
                    {{ getMuscleLabel(exercise.primaryMuscle) }}
                  </UBadge>
                  <UBadge
                    v-for="muscle in exercise.secondaryMuscles"
                    :key="muscle"
                    color="neutral"
                    variant="subtle"
                    size="xs"
                  >
                    {{ getMuscleLabel(muscle) }}
                  </UBadge>
                </div>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <UBadge
                  v-if="exercise.jointFriendly"
                  color="success"
                  variant="subtle"
                  size="xs"
                >
                  <UIcon name="i-lucide-heart" class="w-3 h-3 mr-1" />
                  Joint Friendly
                </UBadge>
                <UBadge
                  :color="getDifficultyColor(exercise.difficulty)"
                  variant="subtle"
                  size="xs"
                  class="capitalize"
                >
                  {{ exercise.difficulty }}
                </UBadge>
              </div>
            </div>

            <div class="flex items-center gap-4 text-sm text-muted">
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-dumbbell" class="w-4 h-4" />
                {{ getEquipmentLabel(exercise.equipment) }}
              </div>
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-star" class="w-4 h-4" />
                Effectiveness: {{ exercise.effectivenessRank }}/5
              </div>
            </div>
          </button>
        </div>

        <!-- Empty state -->
        <div
          v-if="filteredAndSortedExercises.length === 0"
          class="text-center py-12"
        >
          <UIcon name="i-lucide-search-x" class="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 class="font-medium mb-2">
            No exercises found
          </h3>
          <p class="text-sm text-muted">
            Try adjusting your filters
          </p>
        </div>
      </div>
    </UDashboardPanelContent>

    <!-- Exercise Detail Modal -->
    <UModal v-model:open="exerciseModalOpen">
      <template #content>
        <UCard v-if="selectedExercise" class="sm:min-w-[500px]">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">
                  {{ selectedExercise.name }}
                </h3>
                <p class="text-sm text-muted">
                  {{ getEquipmentLabel(selectedExercise.equipment) }} · {{ selectedExercise.difficulty }}
                </p>
              </div>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="selectedExercise = null"
              />
            </div>
          </template>

          <div class="space-y-4">
            <!-- Effectiveness Rating -->
            <div class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium mb-1">
                    Effectiveness for Muscle Growth
                  </h4>
                  <div class="flex items-center gap-2">
                    <span class="text-2xl text-amber-500">
                      {{ getEffectivenessStars(selectedExercise.effectivenessRank) }}
                    </span>
                    <span class="text-sm text-muted">{{ selectedExercise.effectivenessRank }}/5</span>
                  </div>
                </div>
                <UButton
                  color="primary"
                  variant="outline"
                  size="sm"
                  icon="i-lucide-play-circle"
                  @click="openVideo(selectedExercise.youtubeId)"
                >
                  Watch Form Video
                </UButton>
              </div>
            </div>

            <!-- Target muscles -->
            <div>
              <h4 class="text-sm font-medium mb-2">
                Target Muscles
              </h4>
              <div class="flex flex-wrap gap-2">
                <UBadge color="primary" variant="solid">
                  {{ getMuscleLabel(selectedExercise.primaryMuscle) }} (Primary)
                </UBadge>
                <UBadge
                  v-for="muscle in selectedExercise.secondaryMuscles"
                  :key="muscle"
                  color="neutral"
                  variant="subtle"
                >
                  {{ getMuscleLabel(muscle) }}
                </UBadge>
              </div>
            </div>

            <!-- Instructions -->
            <div>
              <h4 class="text-sm font-medium mb-2">
                Instructions
              </h4>
              <p class="text-muted">
                {{ selectedExercise.instructions }}
              </p>
            </div>

            <!-- Tips -->
            <div>
              <h4 class="text-sm font-medium mb-2">
                Tips
              </h4>
              <p class="text-muted">
                {{ selectedExercise.tips }}
              </p>
            </div>

            <!-- Rep Range Benchmarks -->
            <div>
              <h4 class="text-sm font-medium mb-2">
                Rep Range Benchmarks
              </h4>
              <div class="space-y-2">
                <div
                  v-for="level in (['beginner', 'intermediate', 'advanced'] as const)"
                  :key="level"
                  class="p-3 rounded-lg bg-elevated border border-default"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <UBadge
                        :color="getDifficultyColor(level)"
                        variant="subtle"
                        size="xs"
                        class="capitalize"
                      >
                        {{ level }}
                      </UBadge>
                    </div>
                    <div class="text-sm">
                      {{ getRepBenchmarks(selectedExercise)[level].sets }}x{{ getRepBenchmarks(selectedExercise)[level].reps }} @ {{ getRepBenchmarks(selectedExercise)[level].weight }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-if="selectedExercise.jointFriendly"
                color="success"
                variant="subtle"
              >
                <UIcon name="i-lucide-heart" class="w-3 h-3 mr-1" />
                Joint Friendly
              </UBadge>
              <UBadge
                :color="getDifficultyColor(selectedExercise.difficulty)"
                variant="subtle"
                class="capitalize"
              >
                {{ selectedExercise.difficulty }}
              </UBadge>
              <UBadge color="neutral" variant="subtle">
                <UIcon name="i-lucide-dumbbell" class="w-3 h-3 mr-1" />
                {{ getEquipmentLabel(selectedExercise.equipment) }}
              </UBadge>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" color="neutral" @click="selectedExercise = null">
                Close
              </UButton>
              <UButton @click="openAddToWorkout(selectedExercise)">
                Add to Workout
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Video Modal -->
    <UModal v-model:open="showVideoModal" :ui="{ content: 'sm:max-w-3xl' }">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">
                  Exercise Form Video
                </h3>
                <p class="text-sm text-muted">
                  Watch this video to learn proper form
                </p>
              </div>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="closeVideoModal"
              />
            </div>
          </template>

          <div class="aspect-video w-full">
            <iframe
              v-if="videoUrl"
              :src="videoUrl"
              class="w-full h-full rounded-lg"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" color="neutral" @click="closeVideoModal">
                Close
              </UButton>
              <UButton
                :href="videoUrl.replace('embed/', 'watch?v=')"
                target="_blank"
                icon="i-lucide-external-link"
              >
                Open in YouTube
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Add to Workout Day Modal -->
    <UModal v-model:open="showWorkoutDayModal">
      <template #content>
        <UCard v-if="exerciseToAdd">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">
                  Select Workout Day
                </h3>
                <p class="text-sm text-muted">
                  Choose which day to add {{ exerciseToAdd.name }}
                </p>
              </div>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="showWorkoutDayModal = false"
              />
            </div>
          </template>

          <div class="space-y-3">
            <button
              v-for="(day, index) in currentPlan.days"
              :key="index"
              type="button"
              class="w-full p-4 rounded-lg border transition-all text-left"
              :class="[
                selectedWorkoutDay === index
                  ? 'border-primary bg-primary/10'
                  : 'border-default bg-elevated hover:border-primary/50'
              ]"
              @click="selectedWorkoutDay = index"
            >
              <div class="flex items-center justify-between mb-1">
                <h4 class="font-medium">
                  {{ day.name }}
                </h4>
                <div class="flex items-center">
                  <UIcon
                    v-if="selectedWorkoutDay === index"
                    name="i-lucide-check-circle"
                    class="w-5 h-5 text-primary"
                  />
                </div>
              </div>
              <p class="text-sm text-muted">
                {{ day.focus }}
              </p>
              <p class="text-xs text-muted mt-1">
                {{ day.exercises.length }} exercises
              </p>
            </button>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" color="neutral" @click="showWorkoutDayModal = false">
                Cancel
              </UButton>
              <UButton
                :disabled="selectedWorkoutDay === null"
                @click="addExerciseToWorkout"
              >
                Add Exercise
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </UDashboardPanel>
</template>
