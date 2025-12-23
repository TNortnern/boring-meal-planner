import { createSharedComposable } from '@vueuse/core'
import { ref, computed, watch } from 'vue'

export interface WeightEntry {
  date: Date
  weight: number
}

export interface MeasurementEntry {
  date: Date
  waist: number
  chest: number
  arms: number
  thighs: number
  bodyFat?: number
}

export interface ProgressPhoto {
  id: string
  date: Date
  type: 'front' | 'side' | 'back'
  url: string
}

const _useProgress = () => {
  // Use refs instead of useLocalStorage to avoid SSR hydration mismatches
  const isInitialized = ref(false)

  // Default values
  const startWeight = ref(195.0)
  const goalWeight = ref(175.0)
  const currentWeight = ref(195.0)
  const weightHistory = ref<WeightEntry[]>([])
  const measurementHistory = ref<MeasurementEntry[]>([])
  const progressPhotos = ref<ProgressPhoto[]>([])

  // Load state from localStorage (client-side only)
  const loadFromStorage = () => {
    if (import.meta.client && !isInitialized.value) {
      // Load simple values
      const storedStartWeight = localStorage.getItem('progress-start-weight')
      if (storedStartWeight) startWeight.value = parseFloat(storedStartWeight)

      const storedGoalWeight = localStorage.getItem('progress-goal-weight')
      if (storedGoalWeight) goalWeight.value = parseFloat(storedGoalWeight)

      const storedCurrentWeight = localStorage.getItem('progress-current-weight')
      if (storedCurrentWeight) currentWeight.value = parseFloat(storedCurrentWeight)

      // Load weight history with date parsing
      const storedWeightHistory = localStorage.getItem('progress-weight-history')
      if (storedWeightHistory) {
        try {
          const parsed = JSON.parse(storedWeightHistory)
          weightHistory.value = parsed.map((entry: { date: string, weight: number }) => ({
            ...entry,
            date: new Date(entry.date)
          }))
        } catch {
          weightHistory.value = []
        }
      }

      // Load measurement history with date parsing
      const storedMeasurements = localStorage.getItem('progress-measurement-history')
      if (storedMeasurements) {
        try {
          const parsed = JSON.parse(storedMeasurements)
          measurementHistory.value = parsed.map((entry: { date: string, waist: number, chest: number, arms: number, thighs?: number, bodyFat?: number }) => ({
            ...entry,
            date: new Date(entry.date)
          }))
        } catch {
          measurementHistory.value = []
        }
      }

      // Load progress photos with date parsing
      const storedPhotos = localStorage.getItem('progress-photos')
      if (storedPhotos) {
        try {
          const parsed = JSON.parse(storedPhotos)
          progressPhotos.value = parsed.map((photo: { id: string, date: string, type: string, url: string }) => ({
            ...photo,
            date: new Date(photo.date)
          }))
        } catch {
          progressPhotos.value = []
        }
      }

      isInitialized.value = true
    }
  }

  // Save state to localStorage (client-side only)
  const saveToStorage = () => {
    if (import.meta.client) {
      localStorage.setItem('progress-start-weight', String(startWeight.value))
      localStorage.setItem('progress-goal-weight', String(goalWeight.value))
      localStorage.setItem('progress-current-weight', String(currentWeight.value))
      localStorage.setItem('progress-weight-history', JSON.stringify(weightHistory.value))
      localStorage.setItem('progress-measurement-history', JSON.stringify(measurementHistory.value))
      localStorage.setItem('progress-photos', JSON.stringify(progressPhotos.value))
    }
  }

  // Watch for changes and persist (only on client)
  if (import.meta.client) {
    watch([startWeight, goalWeight, currentWeight, weightHistory, measurementHistory, progressPhotos], saveToStorage, { deep: true })
  }

  // Computed values
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

    // Convert to weekly rate
    return (weightDiff / daysDiff) * 7
  })

  const totalLost = computed(() => {
    return startWeight.value - currentWeight.value
  })

  const progressToGoal = computed(() => {
    const total = startWeight.value - goalWeight.value
    const current = startWeight.value - currentWeight.value
    return Math.min((current / total) * 100, 100)
  })

  const latestMeasurement = computed(() => {
    if (measurementHistory.value.length === 0) {
      return { waist: 0, chest: 0, arms: 0, thighs: 0, bodyFat: undefined }
    }
    const sorted = [...measurementHistory.value].sort((a, b) => b.date.getTime() - a.date.getTime())
    return sorted[0]
  })

  const firstMeasurement = computed(() => {
    if (measurementHistory.value.length === 0) {
      return { waist: 0, chest: 0, arms: 0, thighs: 0, bodyFat: undefined }
    }
    const sorted = [...measurementHistory.value].sort((a, b) => a.date.getTime() - b.date.getTime())
    return sorted[0]
  })

  // Functions
  const addWeightEntry = (weight: number, date: Date = new Date()) => {
    weightHistory.value.push({ date, weight })
    currentWeight.value = weight

    // Sort by date
    weightHistory.value.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  const addMeasurement = (measurement: Omit<MeasurementEntry, 'date'>, date: Date = new Date()) => {
    measurementHistory.value.push({ ...measurement, date })

    // Sort by date
    measurementHistory.value.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  const addProgressPhoto = (photo: Omit<ProgressPhoto, 'id' | 'date'>, date: Date = new Date()) => {
    const id = `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    progressPhotos.value.push({ ...photo, id, date })

    // Sort by date descending
    progressPhotos.value.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  const deleteWeightEntry = (date: Date) => {
    const index = weightHistory.value.findIndex(entry =>
      entry.date.getTime() === date.getTime()
    )
    if (index !== -1) {
      weightHistory.value.splice(index, 1)

      // Update current weight to most recent
      if (weightHistory.value.length > 0) {
        const sorted = [...weightHistory.value].sort((a, b) => b.date.getTime() - a.date.getTime())
        const mostRecent = sorted[0]
        if (mostRecent) {
          currentWeight.value = mostRecent.weight
        }
      }
    }
  }

  const deleteMeasurement = (date: Date) => {
    const index = measurementHistory.value.findIndex(entry =>
      entry.date.getTime() === date.getTime()
    )
    if (index !== -1) {
      measurementHistory.value.splice(index, 1)
    }
  }

  const deleteProgressPhoto = (id: string) => {
    const index = progressPhotos.value.findIndex(photo => photo.id === id)
    if (index !== -1) {
      progressPhotos.value.splice(index, 1)
    }
  }

  const editCheckIn = (date: Date, data: { weight: number, measurement: Omit<MeasurementEntry, 'date'> }) => {
    // Update weight entry
    const weightIndex = weightHistory.value.findIndex(entry =>
      entry.date.getTime() === date.getTime()
    )
    if (weightIndex !== -1) {
      const weightEntry = weightHistory.value[weightIndex]
      if (weightEntry) {
        weightEntry.weight = data.weight
      }
      weightHistory.value.sort((a, b) => a.date.getTime() - b.date.getTime())

      // Update current weight if this is the most recent entry
      const sorted = [...weightHistory.value].sort((a, b) => b.date.getTime() - a.date.getTime())
      const mostRecent = sorted[0]
      if (mostRecent) {
        currentWeight.value = mostRecent.weight
      }
    }

    // Update measurement entry
    const measurementIndex = measurementHistory.value.findIndex(entry =>
      entry.date.getTime() === date.getTime()
    )
    if (measurementIndex !== -1) {
      measurementHistory.value[measurementIndex] = {
        ...data.measurement,
        date
      }
      measurementHistory.value.sort((a, b) => a.date.getTime() - b.date.getTime())
    }
  }

  const deleteCheckIn = (date: Date) => {
    deleteWeightEntry(date)
    deleteMeasurement(date)
  }

  return {
    // State
    startWeight,
    goalWeight,
    currentWeight,
    weightHistory,
    measurementHistory,
    progressPhotos,

    // Computed
    weeklyAverage,
    totalLost,
    progressToGoal,
    latestMeasurement,
    firstMeasurement,

    // Functions
    init: loadFromStorage,
    addWeightEntry,
    addMeasurement,
    addProgressPhoto,
    deleteWeightEntry,
    deleteMeasurement,
    deleteProgressPhoto,
    editCheckIn,
    deleteCheckIn
  }
}

export const useProgress = createSharedComposable(_useProgress)
