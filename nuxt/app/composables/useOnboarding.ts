import type { UserStats, MacroTargets } from './useMacroCalculator'

export interface OnboardingState {
  step: number
  // Step 1: User info
  name: string
  email: string

  // Step 2: Goal
  goal: 'cut' | 'maintain' | 'gain'
  aggression: 'safe' | 'aggressive'
  deadlineDate: string | null

  // Step 3: Body stats
  sex: 'male' | 'female' | 'unspecified'
  age: number | null
  height: { value: number | null, unit: 'cm' | 'in' | 'ft', feet?: number | null, inches?: number | null }
  weight: { value: number | null, unit: 'kg' | 'lbs' }
  bodyFat: number | null

  // Step 4: Activity
  liftingDays: number
  dailySteps: number

  // Step 5: Dietary restrictions
  allergies: string[]
  dietaryPattern: 'none' | 'halal' | 'kosher' | 'vegetarian' | 'pescatarian' | 'vegan'
  excludedFoods: string[]

  // Step 6: Preferences
  cookEverything: boolean
  repeatMeals: boolean
  mealsPerDay: number
  cardioPreference: 'incline_walk' | 'bike' | 'none'
  boringLevel: 'not_boring' | 'boring_ish' | 'very_boring' | 'maximum_boring'
  fastFoodPreference: 'none' | 'healthy' | 'doordash'

  // Calculated
  macroTargets: MacroTargets | null
}

const defaultState: OnboardingState = {
  step: 1,
  name: '',
  email: '',
  goal: 'maintain',
  aggression: 'safe',
  deadlineDate: null,
  sex: 'unspecified',
  age: null,
  height: { value: null, unit: 'cm' },
  weight: { value: null, unit: 'kg' },
  bodyFat: null,
  liftingDays: 4,
  dailySteps: 8000,
  allergies: [],
  dietaryPattern: 'none',
  excludedFoods: [],
  cookEverything: true,
  repeatMeals: true,
  mealsPerDay: 3,
  cardioPreference: 'incline_walk',
  boringLevel: 'very_boring',
  fastFoodPreference: 'none',
  macroTargets: null
}

export function useOnboarding() {
  const state = useState<OnboardingState>('onboarding', () => ({ ...defaultState }))
  const { calculateMacros } = useMacroCalculator()

  const totalSteps = 7 // User info, Goal, Stats, Activity, Diet, Preferences, Summary

  const progress = computed(() => (state.value.step / totalSteps) * 100)

  const canProceed = computed(() => {
    switch (state.value.step) {
      case 1: // User info
        return !!state.value.name && !!state.value.email
      case 2: // Goal
        return !!state.value.goal
      case 3: { // Stats
        const hasHeight = state.value.height.unit === 'ft'
          ? (state.value.height.feet && state.value.height.inches !== null)
          : !!state.value.height.value
        return hasHeight && state.value.weight.value
      }
      case 4: // Activity
        return state.value.liftingDays >= 0 && state.value.dailySteps >= 0
      case 5: // Diet
        return true // All optional
      case 6: // Preferences
        return state.value.mealsPerDay >= 2
      case 7: // Summary
        return !!state.value.macroTargets
      default:
        return false
    }
  })

  const nextStep = () => {
    if (state.value.step < totalSteps) {
      state.value.step++

      // Calculate macros when reaching summary
      if (state.value.step === 7) {
        calculateFinalMacros()
      }
    }
  }

  const prevStep = () => {
    if (state.value.step > 1) {
      state.value.step--
    }
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      state.value.step = step
    }
  }

  const getHeightCm = (): number => {
    const h = state.value.height
    if (h.unit === 'ft') {
      const feet = h.feet || 0
      const inches = h.inches || 0
      const totalInches = (feet * 12) + inches
      return totalInches * 2.54
    }
    if (!h.value) return 170 // default
    return h.unit === 'in' ? h.value * 2.54 : h.value
  }

  const getWeightKg = (): number => {
    const w = state.value.weight
    if (!w.value) return 70 // default
    return w.unit === 'lbs' ? w.value * 0.453592 : w.value
  }

  const calculateFinalMacros = () => {
    const stats: UserStats = {
      sex: state.value.sex,
      age: state.value.age || 30,
      heightCm: getHeightCm(),
      weightKg: getWeightKg(),
      liftingDays: state.value.liftingDays,
      dailySteps: state.value.dailySteps,
      goal: state.value.goal,
      aggression: state.value.aggression
    }

    state.value.macroTargets = calculateMacros(stats)
  }

  const reset = () => {
    state.value = { ...defaultState }
  }

  return {
    state,
    totalSteps,
    progress,
    canProceed,
    nextStep,
    prevStep,
    goToStep,
    getHeightCm,
    getWeightKg,
    calculateFinalMacros,
    reset
  }
}
