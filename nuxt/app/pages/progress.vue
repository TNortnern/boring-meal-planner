<script setup lang="ts">
import { format } from 'date-fns'

const {
  startWeight,
  goalWeight,
  currentWeight,
  weightHistory,
  measurementHistory,
  progressPhotos,
  weeklyAverage,
  totalLost,
  progressToGoal,
  latestMeasurement,
  firstMeasurement,
  addWeightEntry,
  addMeasurement,
  addProgressPhoto,
  editCheckIn,
  deleteCheckIn
} = useProgress()

const { uploadProgressPhoto } = useBunnyUpload()

const activeTab = ref<'overview' | 'weight' | 'photos' | 'measurements'>('overview')

const firstWeightEntry = computed(() => {
  const sorted = [...weightHistory.value].sort((a, b) => a.date.getTime() - b.date.getTime())
  return sorted[0]
})

// Check-in data
const lastCheckIn = computed(() => {
  if (measurementHistory.value.length === 0) {
    return {
      date: new Date(),
      weight: currentWeight.value,
      waist: 0,
      chest: 0,
      arms: 0,
      thighs: 0,
      bodyFat: undefined as number | undefined,
      notes: ''
    }
  }
  const sorted = [...measurementHistory.value].sort((a, b) => b.date.getTime() - a.date.getTime())
  const latest = sorted[0]
  if (!latest) {
    return {
      date: new Date(),
      weight: currentWeight.value,
      waist: 0,
      chest: 0,
      arms: 0,
      thighs: 0,
      bodyFat: undefined as number | undefined,
      notes: ''
    }
  }
  return {
    ...latest,
    weight: currentWeight.value,
    notes: ''
  }
})

const checkInOpen = ref(false)
const editMode = ref(false)
const editingDate = ref<Date | null>(null)
const newCheckIn = ref({
  weight: 0,
  waist: 0,
  chest: 0,
  arms: 0,
  thighs: 0,
  bodyFat: undefined as number | undefined,
  notes: ''
})

const openNewCheckIn = () => {
  editMode.value = false
  editingDate.value = null
  newCheckIn.value = {
    weight: currentWeight.value,
    waist: lastCheckIn.value.waist || 0,
    chest: lastCheckIn.value.chest || 0,
    arms: lastCheckIn.value.arms || 0,
    thighs: lastCheckIn.value.thighs || 0,
    bodyFat: lastCheckIn.value.bodyFat,
    notes: ''
  }
  checkInOpen.value = true
}

const openEditCheckIn = (date: Date) => {
  editMode.value = true
  editingDate.value = date

  // Find the weight entry for this date
  const weightEntry = weightHistory.value.find(e => e.date.getTime() === date.getTime())
  const measurementEntry = measurementHistory.value.find(e => e.date.getTime() === date.getTime())

  if (weightEntry && measurementEntry) {
    newCheckIn.value = {
      weight: weightEntry.weight,
      waist: measurementEntry.waist,
      chest: measurementEntry.chest,
      arms: measurementEntry.arms,
      thighs: measurementEntry.thighs,
      bodyFat: measurementEntry.bodyFat,
      notes: ''
    }
  }

  checkInOpen.value = true
}

const toast = useToast()
const photoUploadLoading = ref(false)

const saveCheckIn = () => {
  if (editMode.value && editingDate.value) {
    editCheckIn(editingDate.value, {
      weight: newCheckIn.value.weight,
      measurement: {
        waist: newCheckIn.value.waist,
        chest: newCheckIn.value.chest,
        arms: newCheckIn.value.arms,
        thighs: newCheckIn.value.thighs,
        bodyFat: newCheckIn.value.bodyFat
      }
    })
    toast.add({
      title: 'Check-in updated',
      description: 'Your progress has been updated.',
      icon: 'i-lucide-check',
      color: 'success'
    })
  } else {
    addWeightEntry(newCheckIn.value.weight)
    addMeasurement({
      waist: newCheckIn.value.waist,
      chest: newCheckIn.value.chest,
      arms: newCheckIn.value.arms,
      thighs: newCheckIn.value.thighs,
      bodyFat: newCheckIn.value.bodyFat
    })

    toast.add({
      title: 'Check-in saved',
      description: 'Your progress has been recorded.',
      icon: 'i-lucide-check',
      color: 'success'
    })
  }

  checkInOpen.value = false
}

const deleteCheckInOpen = ref(false)
const deletingDate = ref<Date | null>(null)

const openDeleteCheckIn = (date: Date) => {
  deletingDate.value = date
  deleteCheckInOpen.value = true
}

const confirmDeleteCheckIn = () => {
  if (deletingDate.value) {
    deleteCheckIn(deletingDate.value)
    toast.add({
      title: 'Check-in deleted',
      description: 'The check-in has been removed.',
      icon: 'i-lucide-trash',
      color: 'error'
    })
  }
  deleteCheckInOpen.value = false
  deletingDate.value = null
}

// Combined check-in history (sorted by date descending)
const checkInHistory = computed(() => {
  // Get all unique dates from both weight and measurement history
  const dates = new Set([
    ...weightHistory.value.map(e => e.date.getTime()),
    ...measurementHistory.value.map(e => e.date.getTime())
  ])

  return Array.from(dates)
    .map((timestamp) => {
      const date = new Date(timestamp)
      const weight = weightHistory.value.find(e => e.date.getTime() === timestamp)
      const measurement = measurementHistory.value.find(e => e.date.getTime() === timestamp)

      return {
        date,
        weight: weight?.weight,
        waist: measurement?.waist,
        chest: measurement?.chest,
        arms: measurement?.arms,
        thighs: measurement?.thighs,
        bodyFat: measurement?.bodyFat
      }
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
})

const addWeightOpen = ref(false)
const newWeightEntry = ref({
  weight: 0,
  date: format(new Date(), 'yyyy-MM-dd')
})

const _openAddWeight = () => {
  newWeightEntry.value = {
    weight: currentWeight.value,
    date: format(new Date(), 'yyyy-MM-dd')
  }
  addWeightOpen.value = true
}

const saveWeightEntry = () => {
  addWeightEntry(newWeightEntry.value.weight, new Date(newWeightEntry.value.date))
  toast.add({
    title: 'Weight added',
    description: 'Your weight has been recorded.',
    icon: 'i-lucide-check',
    color: 'success'
  })
  addWeightOpen.value = false
}

const handlePhotoUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const file = input.files[0]
  if (!file) return

  photoUploadLoading.value = true

  try {
    const result = await uploadProgressPhoto(file)

    if (result.success && result.url) {
      addProgressPhoto({
        type: 'front',
        url: result.url
      })

      toast.add({
        title: 'Photo uploaded',
        description: 'Your progress photo has been saved.',
        icon: 'i-lucide-check',
        color: 'success'
      })
    } else {
      toast.add({
        title: 'Upload failed',
        description: result.error || 'Failed to upload photo.',
        icon: 'i-lucide-x',
        color: 'error'
      })
    }
  } catch (err: unknown) {
    toast.add({
      title: 'Upload failed',
      description: err instanceof Error ? err.message : 'Failed to upload photo.',
      icon: 'i-lucide-x',
      color: 'error'
    })
  } finally {
    photoUploadLoading.value = false
    input.value = ''
  }
}
</script>

<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="Progress">
      <template #leading>
        <UDashboardSidebarToggle />
      </template>

      <template #right>
        <div class="flex items-center gap-3">
          <UButton icon="i-lucide-plus" @click="openNewCheckIn">
            New Check-in
          </UButton>
          <UColorModeButton />
        </div>
      </template>
    </UDashboardNavbar>

    <UDashboardPanelContent class="px-4 sm:px-6 lg:px-8">
      <div class="space-y-6">
        <!-- Progress Summary Cards -->
        <div class="grid gap-4 md:grid-cols-5">
          <div class="p-4 rounded-xl bg-elevated border border-default">
            <div class="text-sm text-muted mb-1">
              Current Weight
            </div>
            <div class="text-2xl font-bold">
              {{ currentWeight }} lbs
            </div>
            <div class="text-xs text-success mt-1">
              ↓ {{ weeklyAverage.toFixed(1) }} lbs this week
            </div>
          </div>

          <div class="p-4 rounded-xl bg-elevated border border-default">
            <div class="text-sm text-muted mb-1">
              Total Lost
            </div>
            <div class="text-2xl font-bold text-success">
              {{ totalLost.toFixed(1) }} lbs
            </div>
            <div class="text-xs text-muted mt-1">
              Since {{ firstWeightEntry ? format(firstWeightEntry.date, 'MMM d') : 'N/A' }}
            </div>
          </div>

          <div class="p-4 rounded-xl bg-elevated border border-default">
            <div class="text-sm text-muted mb-1">
              Body Fat %
            </div>
            <div class="text-2xl font-bold">
              {{ latestMeasurement?.bodyFat || '--' }}{{ latestMeasurement?.bodyFat ? '%' : '' }}
            </div>
            <div v-if="latestMeasurement?.bodyFat && firstMeasurement?.bodyFat" class="text-xs text-success mt-1">
              ↓ {{ ((firstMeasurement?.bodyFat || 0) - (latestMeasurement?.bodyFat || 0)).toFixed(1) }}% since start
            </div>
          </div>

          <div class="p-4 rounded-xl bg-elevated border border-default">
            <div class="text-sm text-muted mb-1">
              Goal Weight
            </div>
            <div class="text-2xl font-bold">
              {{ goalWeight }} lbs
            </div>
            <div class="text-xs text-muted mt-1">
              {{ (currentWeight - goalWeight).toFixed(1) }} lbs to go
            </div>
          </div>

          <div class="p-4 rounded-xl bg-elevated border border-default">
            <div class="text-sm text-muted mb-1">
              Progress
            </div>
            <div class="text-2xl font-bold">
              {{ progressToGoal.toFixed(0) }}%
            </div>
            <UProgress :model-value="progressToGoal" size="sm" class="mt-2" />
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="flex gap-2 border-b border-default">
          <button
            v-for="tab in ['overview', 'weight', 'photos', 'measurements'] as const"
            :key="tab"
            type="button"
            class="px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px"
            :class="activeTab === tab
              ? 'text-primary border-primary'
              : 'text-muted border-transparent hover:text-default'"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <!-- Last Check-in -->
          <div class="p-4 rounded-xl bg-elevated border border-default">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold">
                Last Check-in
              </h3>
              <span class="text-sm text-muted">{{ format(lastCheckIn.date, 'MMM d, yyyy') }}</span>
            </div>

            <div class="grid gap-4 md:grid-cols-5 mb-4">
              <div>
                <div class="text-sm text-muted">
                  Weight
                </div>
                <div class="font-medium">
                  {{ lastCheckIn.weight }} lbs
                </div>
              </div>
              <div>
                <div class="text-sm text-muted">
                  Waist
                </div>
                <div class="font-medium">
                  {{ lastCheckIn.waist }}"
                </div>
              </div>
              <div>
                <div class="text-sm text-muted">
                  Chest
                </div>
                <div class="font-medium">
                  {{ lastCheckIn.chest }}"
                </div>
              </div>
              <div>
                <div class="text-sm text-muted">
                  Arms
                </div>
                <div class="font-medium">
                  {{ lastCheckIn.arms }}"
                </div>
              </div>
              <div>
                <div class="text-sm text-muted">
                  Thighs
                </div>
                <div class="font-medium">
                  {{ lastCheckIn.thighs }}"
                </div>
              </div>
            </div>

            <div v-if="lastCheckIn.bodyFat" class="mb-4 pb-4 border-b border-default">
              <div class="text-sm text-muted mb-1">
                Body Fat
              </div>
              <div class="text-lg font-semibold">
                {{ lastCheckIn.bodyFat }}%
              </div>
            </div>

            <div v-if="lastCheckIn.notes" class="pt-4 border-t border-default">
              <div class="text-sm text-muted mb-1">
                Notes
              </div>
              <p class="text-sm">
                {{ lastCheckIn.notes }}
              </p>
            </div>
          </div>

          <!-- Check-in History -->
          <div class="p-4 rounded-xl bg-elevated border border-default">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold">
                Check-in History
              </h3>
            </div>
            <div class="space-y-3">
              <div
                v-for="entry in checkInHistory"
                :key="entry.date.toISOString()"
                class="p-3 rounded-lg border border-default hover:bg-muted/30 transition-colors"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium">{{ format(entry.date, 'MMM d, yyyy') }}</span>
                  <div class="flex items-center gap-2">
                    <UButton
                      icon="i-lucide-pencil"
                      size="xs"
                      variant="ghost"
                      color="neutral"
                      @click="openEditCheckIn(entry.date)"
                    />
                    <UButton
                      icon="i-lucide-trash-2"
                      size="xs"
                      variant="ghost"
                      color="error"
                      @click="openDeleteCheckIn(entry.date)"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-4 text-sm">
                  <div v-if="entry.weight">
                    <span class="text-muted">Weight:</span>
                    <span class="ml-1 font-medium">{{ entry.weight }} lbs</span>
                  </div>
                  <div v-if="entry.waist">
                    <span class="text-muted">Waist:</span>
                    <span class="ml-1 font-medium">{{ entry.waist }}"</span>
                  </div>
                  <div v-if="entry.chest">
                    <span class="text-muted">Chest:</span>
                    <span class="ml-1 font-medium">{{ entry.chest }}"</span>
                  </div>
                  <div v-if="entry.arms">
                    <span class="text-muted">Arms:</span>
                    <span class="ml-1 font-medium">{{ entry.arms }}"</span>
                  </div>
                  <div v-if="entry.thighs">
                    <span class="text-muted">Thighs:</span>
                    <span class="ml-1 font-medium">{{ entry.thighs }}"</span>
                  </div>
                  <div v-if="entry.bodyFat">
                    <span class="text-muted">Body Fat:</span>
                    <span class="ml-1 font-medium">{{ entry.bodyFat }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Weight Tab -->
        <div v-if="activeTab === 'weight'" class="space-y-6">
          <div class="p-4 rounded-xl bg-elevated border border-default">
            <h3 class="font-semibold mb-4">
              Weight History
            </h3>

            <!-- Simple chart visualization -->
            <div class="h-48 flex items-end gap-2 mb-4">
              <div
                v-for="entry in weightHistory"
                :key="entry.date.toISOString()"
                class="flex-1 flex flex-col items-center"
              >
                <div
                  class="w-full bg-primary rounded-t transition-all"
                  :style="{
                    height: `${((entry.weight - goalWeight) / (startWeight - goalWeight)) * 100}%`,
                    minHeight: '20px'
                  }"
                />
                <div class="text-xs text-muted mt-2">
                  {{ format(entry.date, 'M/d') }}
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between text-sm text-muted pt-4 border-t border-default">
              <span>Goal: {{ goalWeight }} lbs</span>
              <span>Start: {{ startWeight }} lbs</span>
            </div>
          </div>

          <!-- Weekly Averages -->
          <div class="p-4 rounded-xl bg-elevated border border-default">
            <h3 class="font-semibold mb-4">
              Weekly Change
            </h3>
            <div class="text-center py-4">
              <div class="text-4xl font-bold text-success">
                -{{ weeklyAverage.toFixed(1) }}
              </div>
              <div class="text-sm text-muted mt-1">
                lbs per week average
              </div>
            </div>
            <p class="text-sm text-muted text-center">
              At this rate, you'll reach your goal in approximately
              <span class="font-medium text-default">
                {{ Math.ceil((currentWeight - goalWeight) / weeklyAverage) }} weeks
              </span>
            </p>
          </div>
        </div>

        <!-- Photos Tab -->
        <div v-if="activeTab === 'photos'" class="space-y-6">
          <div v-if="progressPhotos.length > 0" class="grid gap-4 md:grid-cols-3">
            <div
              v-for="photo in progressPhotos"
              :key="photo.id"
              class="aspect-[3/4] rounded-xl bg-muted/30 border border-default overflow-hidden"
            >
              <img
                :src="photo.url"
                :alt="`Progress photo from ${format(photo.date, 'MMM d')}`"
                class="w-full h-full object-cover"
              >
              <div class="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                <div class="text-sm font-medium">
                  {{ format(photo.date, 'MMM d') }}
                </div>
                <div class="text-xs capitalize">
                  {{ photo.type }}
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12 text-muted">
            <UIcon name="i-lucide-image" class="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No progress photos yet. Upload your first one!</p>
          </div>

          <div class="relative">
            <input
              type="file"
              accept="image/*"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              @change="handlePhotoUpload"
            >
            <UButton
              variant="outline"
              color="neutral"
              block
              icon="i-lucide-camera"
              :loading="photoUploadLoading"
            >
              Add Progress Photo
            </UButton>
          </div>
        </div>

        <!-- Measurements Tab -->
        <div v-if="activeTab === 'measurements'" class="space-y-6">
          <div class="grid gap-4 md:grid-cols-4">
            <!-- Waist -->
            <div class="p-4 rounded-xl bg-elevated border border-default">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium">
                  Waist
                </h4>
                <UBadge color="success" variant="subtle" size="xs">
                  -{{ ((firstMeasurement?.waist || 0) - (latestMeasurement?.waist || 0)).toFixed(1) }}"
                </UBadge>
              </div>
              <div class="text-2xl font-bold mb-2">
                {{ latestMeasurement?.waist }}"
              </div>
              <div class="space-y-1">
                <div
                  v-for="entry in [...measurementHistory].reverse().slice(0, 3)"
                  :key="entry.date.toISOString()"
                  class="flex justify-between text-sm"
                >
                  <span class="text-muted">{{ format(entry.date, 'MMM d') }}</span>
                  <span>{{ entry.waist }}"</span>
                </div>
              </div>
            </div>

            <!-- Chest -->
            <div class="p-4 rounded-xl bg-elevated border border-default">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium">
                  Chest
                </h4>
                <UBadge color="primary" variant="subtle" size="xs">
                  +{{ ((latestMeasurement?.chest || 0) - (firstMeasurement?.chest || 0)).toFixed(1) }}"
                </UBadge>
              </div>
              <div class="text-2xl font-bold mb-2">
                {{ latestMeasurement?.chest }}"
              </div>
              <div class="space-y-1">
                <div
                  v-for="entry in [...measurementHistory].reverse().slice(0, 3)"
                  :key="entry.date.toISOString()"
                  class="flex justify-between text-sm"
                >
                  <span class="text-muted">{{ format(entry.date, 'MMM d') }}</span>
                  <span>{{ entry.chest }}"</span>
                </div>
              </div>
            </div>

            <!-- Arms -->
            <div class="p-4 rounded-xl bg-elevated border border-default">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium">
                  Arms
                </h4>
                <UBadge color="primary" variant="subtle" size="xs">
                  +{{ ((latestMeasurement?.arms || 0) - (firstMeasurement?.arms || 0)).toFixed(1) }}"
                </UBadge>
              </div>
              <div class="text-2xl font-bold mb-2">
                {{ latestMeasurement?.arms }}"
              </div>
              <div class="space-y-1">
                <div
                  v-for="entry in [...measurementHistory].reverse().slice(0, 3)"
                  :key="entry.date.toISOString()"
                  class="flex justify-between text-sm"
                >
                  <span class="text-muted">{{ format(entry.date, 'MMM d') }}</span>
                  <span>{{ entry.arms }}"</span>
                </div>
              </div>
            </div>

            <!-- Thighs -->
            <div class="p-4 rounded-xl bg-elevated border border-default">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium">
                  Thighs
                </h4>
                <UBadge color="primary" variant="subtle" size="xs">
                  +{{ ((latestMeasurement?.thighs || 0) - (firstMeasurement?.thighs || 0)).toFixed(1) }}"
                </UBadge>
              </div>
              <div class="text-2xl font-bold mb-2">
                {{ latestMeasurement?.thighs }}"
              </div>
              <div class="space-y-1">
                <div
                  v-for="entry in [...measurementHistory].reverse().slice(0, 3)"
                  :key="entry.date.toISOString()"
                  class="flex justify-between text-sm"
                >
                  <span class="text-muted">{{ format(entry.date, 'MMM d') }}</span>
                  <span>{{ entry.thighs }}"</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Body Fat Card -->
          <div v-if="latestMeasurement?.bodyFat" class="p-4 rounded-xl bg-elevated border border-default">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium">
                Body Fat %
              </h4>
              <UBadge
                :color="(firstMeasurement?.bodyFat || 0) > (latestMeasurement?.bodyFat || 0) ? 'success' : 'primary'"
                variant="subtle"
                size="xs"
              >
                {{ (firstMeasurement?.bodyFat || 0) > (latestMeasurement?.bodyFat || 0) ? '-' : '+' }}{{ Math.abs((latestMeasurement?.bodyFat || 0) - (firstMeasurement?.bodyFat || 0)).toFixed(1) }}%
              </UBadge>
            </div>
            <div class="text-2xl font-bold mb-2">
              {{ latestMeasurement?.bodyFat }}%
            </div>
            <div class="space-y-1">
              <div
                v-for="entry in [...measurementHistory].reverse().slice(0, 3).filter(e => e.bodyFat)"
                :key="entry.date.toISOString()"
                class="flex justify-between text-sm"
              >
                <span class="text-muted">{{ format(entry.date, 'MMM d') }}</span>
                <span>{{ entry.bodyFat }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- BORING Mode indicator -->
        <div class="flex items-center justify-center gap-2 py-3 text-sm text-muted">
          <UIcon name="i-lucide-lock" class="w-4 h-4" />
          <span>BORING Mode — Consistent tracking, visible results</span>
        </div>
      </div>
    </UDashboardPanelContent>

    <!-- New/Edit Check-in Modal -->
    <UModal v-model:open="checkInOpen">
      <template #content>
        <UCard class="sm:min-w-[450px]">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">
                  {{ editMode ? 'Edit Check-in' : 'New Check-in' }}
                </h3>
                <p class="text-sm text-muted">
                  {{ editMode && editingDate ? format(editingDate, 'EEEE, MMMM d') : format(new Date(), 'EEEE, MMMM d') }}
                </p>
              </div>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="checkInOpen = false"
              />
            </div>
          </template>

          <div class="space-y-4">
            <UFormField label="Weight (lbs)">
              <UInput
                v-model.number="newCheckIn.weight"
                type="number"
                step="0.1"
                class="w-full"
              />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Waist (in)">
                <UInput
                  v-model.number="newCheckIn.waist"
                  type="number"
                  step="0.25"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Chest (in)">
                <UInput
                  v-model.number="newCheckIn.chest"
                  type="number"
                  step="0.25"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Arms (in)">
                <UInput
                  v-model.number="newCheckIn.arms"
                  type="number"
                  step="0.25"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Thighs (in)">
                <UInput
                  v-model.number="newCheckIn.thighs"
                  type="number"
                  step="0.25"
                  class="w-full"
                />
              </UFormField>
            </div>

            <UFormField label="Body Fat % (optional)">
              <UInput
                v-model.number="newCheckIn.bodyFat"
                type="number"
                step="0.1"
                placeholder="e.g., 15.5"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Notes (optional)">
              <UTextarea
                v-model="newCheckIn.notes"
                placeholder="How are you feeling? Any observations?"
                :rows="3"
                class="w-full"
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" color="neutral" @click="checkInOpen = false">
                Cancel
              </UButton>
              <UButton @click="saveCheckIn">
                {{ editMode ? 'Update Check-in' : 'Save Check-in' }}
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Add Weight Entry Modal -->
    <UModal v-model:open="addWeightOpen">
      <template #content>
        <UCard class="sm:min-w-[400px]">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">
                  Add Weight Entry
                </h3>
                <p class="text-sm text-muted">
                  Log your weight for a specific date
                </p>
              </div>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="addWeightOpen = false"
              />
            </div>
          </template>

          <div class="space-y-4">
            <UFormField label="Weight (lbs)">
              <UInput
                v-model.number="newWeightEntry.weight"
                type="number"
                step="0.1"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Date">
              <UInput
                v-model="newWeightEntry.date"
                type="date"
                class="w-full"
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" color="neutral" @click="addWeightOpen = false">
                Cancel
              </UButton>
              <UButton @click="saveWeightEntry">
                Save Entry
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Delete Check-in Confirmation Modal -->
    <UModal v-model:open="deleteCheckInOpen">
      <template #content>
        <UCard class="sm:min-w-[400px]">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">
                  Delete Check-in
                </h3>
                <p class="text-sm text-muted">
                  This action cannot be undone
                </p>
              </div>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="deleteCheckInOpen = false"
              />
            </div>
          </template>

          <div class="space-y-4">
            <p class="text-sm">
              Are you sure you want to delete this check-in from
              <span class="font-medium">{{ deletingDate ? format(deletingDate, 'MMMM d, yyyy') : '' }}</span>?
              This will remove both the weight entry and measurements.
            </p>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" color="neutral" @click="deleteCheckInOpen = false">
                Cancel
              </UButton>
              <UButton color="error" @click="confirmDeleteCheckIn">
                Delete Check-in
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </UDashboardPanel>
</template>
