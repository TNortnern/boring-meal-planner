<script setup lang="ts">
import { format } from 'date-fns'

// API-backed composables
const { user, isAuthenticated } = useAuth()
const progressLogs = useProgressLogs()
const { uploadProgressPhoto: bunnyUploadProgressPhoto } = useBunnyUpload()

const toast = useToast()
const activeTab = ref<'overview' | 'weight' | 'photos' | 'measurements'>('overview')

// User profile data for goals
const startWeight = computed(() => user.value?.startingWeight || 195)
const goalWeight = computed(() => user.value?.goalWeight || 175)

// Current weight from latest log
const currentWeight = computed(() => progressLogs.currentWeight.value || startWeight.value)

// Weight history from API
const weightHistory = computed(() => progressLogs.weightHistory.value)

// Measurement history from check-in logs
const measurementHistory = computed(() => {
  return progressLogs.checkInHistory.value
    .filter(log => log.chest || log.arms || log.thighs || log.waist)
    .map(log => ({
      date: log.date,
      waist: log.waist || 0,
      chest: log.chest || 0,
      arms: log.arms || 0,
      thighs: log.thighs || 0,
      bodyFat: log.bodyFat
    }))
})

// Progress photos (stored in logs with photo field - for now using localStorage fallback)
const progressPhotos = useLocalStorage<Array<{ id: string, date: Date, type: string, url: string }>>('progress-photos', [])

// Computed values
const firstWeightEntry = computed(() => {
  const sorted = [...weightHistory.value].sort((a, b) => a.date.getTime() - b.date.getTime())
  return sorted[0]
})

const weeklyAverage = computed(() => {
  if (weightHistory.value.length < 2) return 0

  const sorted = [...weightHistory.value].sort((a, b) => a.date.getTime() - b.date.getTime())
  const recent = sorted.slice(-2)

  if (recent.length < 2) return 0

  const entry0 = recent[0]
  const entry1 = recent[1]
  if (!entry0 || !entry1) return 0

  const daysDiff = Math.max(1, (entry1.date.getTime() - entry0.date.getTime()) / (1000 * 60 * 60 * 24))
  const weightDiff = entry0.weight - entry1.weight

  return (weightDiff / daysDiff) * 7
})

const totalLost = computed(() => startWeight.value - currentWeight.value)

const progressToGoal = computed(() => {
  const total = startWeight.value - goalWeight.value
  const current = startWeight.value - currentWeight.value
  if (total <= 0) return 0
  return Math.min((current / total) * 100, 100)
})

const latestMeasurement = computed(() => progressLogs.latestMeasurement.value || { waist: 0, chest: 0, arms: 0, thighs: 0, bodyFat: undefined })
const firstMeasurement = computed(() => progressLogs.firstMeasurement.value || { waist: 0, chest: 0, arms: 0, thighs: 0, bodyFat: undefined })

// Check-in data
const lastCheckIn = computed(() => {
  const history = progressLogs.checkInHistory.value
  if (history.length === 0) {
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
  const latest = history[0]
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
    date: latest.date,
    weight: latest.weight || currentWeight.value,
    waist: latest.waist || 0,
    chest: latest.chest || 0,
    arms: latest.arms || 0,
    thighs: latest.thighs || 0,
    bodyFat: latest.bodyFat,
    notes: latest.notes || ''
  }
})

const checkInOpen = ref(false)
const editMode = ref(false)
const editingLogId = ref<number | null>(null)
const editingDate = ref<Date | null>(null)
const isSaving = ref(false)
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
  editingLogId.value = null
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

const openEditCheckIn = (entry: { id?: number, date: Date, weight?: number, waist?: number, chest?: number, arms?: number, thighs?: number, bodyFat?: number }) => {
  editMode.value = true
  editingLogId.value = entry.id || null
  editingDate.value = entry.date

  newCheckIn.value = {
    weight: entry.weight || currentWeight.value,
    waist: entry.waist || 0,
    chest: entry.chest || 0,
    arms: entry.arms || 0,
    thighs: entry.thighs || 0,
    bodyFat: entry.bodyFat,
    notes: ''
  }

  checkInOpen.value = true
}

const photoUploadLoading = ref(false)

const saveCheckIn = async () => {
  isSaving.value = true

  try {
    if (editMode.value && editingLogId.value) {
      // Update existing log
      const result = await progressLogs.updateLog(editingLogId.value, {
        weight: { value: newCheckIn.value.weight, unit: 'lbs' },
        waist: { value: newCheckIn.value.waist, unit: 'in' },
        measurements: {
          chest: newCheckIn.value.chest,
          arms: newCheckIn.value.arms,
          thighs: newCheckIn.value.thighs,
          bodyFat: newCheckIn.value.bodyFat
        },
        notes: newCheckIn.value.notes,
        isCheckInDay: true
      })

      if (result.success) {
        toast.add({
          title: 'Check-in updated',
          description: 'Your progress has been updated.',
          icon: 'i-lucide-check',
          color: 'success'
        })
      } else {
        toast.add({
          title: 'Error',
          description: result.error || 'Failed to update check-in',
          color: 'error'
        })
      }
    } else {
      // Create new check-in
      const result = await progressLogs.addCheckIn({
        weight: { value: newCheckIn.value.weight, unit: 'lbs' },
        waist: { value: newCheckIn.value.waist, unit: 'in' },
        measurements: {
          chest: newCheckIn.value.chest,
          arms: newCheckIn.value.arms,
          thighs: newCheckIn.value.thighs,
          bodyFat: newCheckIn.value.bodyFat
        },
        notes: newCheckIn.value.notes,
        isCheckInDay: true
      })

      if (result.success) {
        toast.add({
          title: 'Check-in saved',
          description: 'Your progress has been recorded.',
          icon: 'i-lucide-check',
          color: 'success'
        })
      } else {
        toast.add({
          title: 'Error',
          description: result.error || 'Failed to save check-in',
          color: 'error'
        })
      }
    }

    checkInOpen.value = false
  } finally {
    isSaving.value = false
  }
}

const deleteCheckInOpen = ref(false)
const deletingLogId = ref<number | null>(null)
const deletingDate = ref<Date | null>(null)

const openDeleteCheckIn = (entry: { id?: number, date: Date }) => {
  deletingLogId.value = entry.id || null
  deletingDate.value = entry.date
  deleteCheckInOpen.value = true
}

const confirmDeleteCheckIn = async () => {
  if (deletingLogId.value) {
    const result = await progressLogs.deleteLog(deletingLogId.value)
    if (result.success) {
      toast.add({
        title: 'Check-in deleted',
        description: 'The check-in has been removed.',
        icon: 'i-lucide-trash',
        color: 'error'
      })
    } else {
      toast.add({
        title: 'Error',
        description: 'Failed to delete check-in',
        color: 'error'
      })
    }
  }
  deleteCheckInOpen.value = false
  deletingLogId.value = null
  deletingDate.value = null
}

// Check-in history from API
const checkInHistory = computed(() => progressLogs.checkInHistory.value)

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

const saveWeightEntry = async () => {
  const result = await progressLogs.addWeightForDate(
    newWeightEntry.value.weight,
    'lbs',
    new Date(newWeightEntry.value.date)
  )

  if (result.success) {
    toast.add({
      title: 'Weight added',
      description: 'Your weight has been recorded.',
      icon: 'i-lucide-check',
      color: 'success'
    })
    addWeightOpen.value = false
  } else {
    toast.add({
      title: 'Error',
      description: result.error || 'Failed to save weight',
      color: 'error'
    })
  }
}

const handlePhotoUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const file = input.files[0]
  if (!file) return

  photoUploadLoading.value = true

  try {
    const result = await bunnyUploadProgressPhoto(file)

    if (result.success && result.url) {
      // For now, store photos in localStorage until we add media upload to Payload
      const id = `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      progressPhotos.value.push({
        id,
        date: new Date(),
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

// Initialize API data on mount
onMounted(async () => {
  if (isAuthenticated.value) {
    await progressLogs.init()
  }
})

// Watch for auth changes
watch(isAuthenticated, async (authenticated) => {
  if (authenticated) {
    await progressLogs.init()
  }
})
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
                      @click="openEditCheckIn(entry)"
                    />
                    <UButton
                      icon="i-lucide-trash-2"
                      size="xs"
                      variant="ghost"
                      color="error"
                      @click="openDeleteCheckIn(entry)"
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

          <div class="space-y-4 max-h-[60vh] overflow-y-auto">
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
              <UButton
                variant="ghost"
                color="neutral"
                :disabled="isSaving"
                @click="checkInOpen = false"
              >
                Cancel
              </UButton>
              <UButton :loading="isSaving" @click="saveCheckIn">
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

          <div class="space-y-4 max-h-[60vh] overflow-y-auto">
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

          <div class="space-y-4 max-h-[60vh] overflow-y-auto">
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
