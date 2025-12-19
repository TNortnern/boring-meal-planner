export interface UserStats {
  sex: 'male' | 'female' | 'unspecified'
  age: number
  heightCm: number
  weightKg: number
  liftingDays: number
  dailySteps: number
  goal: 'cut' | 'maintain' | 'gain'
  aggression: 'safe' | 'aggressive'
}

export interface MacroTargets {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  water: number // liters
}

/**
 * Calculate daily macro targets based on user stats and goals.
 * Uses Mifflin-St Jeor for BMR, then applies activity multiplier and goal adjustment.
 */
export function useMacroCalculator() {
  const calculateBMR = (stats: UserStats): number => {
    // Mifflin-St Jeor Equation
    const base = 10 * stats.weightKg + 6.25 * stats.heightCm - 5 * stats.age

    if (stats.sex === 'male') {
      return base + 5
    } else if (stats.sex === 'female') {
      return base - 161
    }
    // Unspecified: use average
    return base - 78
  }

  const getActivityMultiplier = (liftingDays: number, dailySteps: number): number => {
    // Base multiplier from lifting frequency
    let multiplier = 1.2 // Sedentary base

    if (liftingDays >= 5) {
      multiplier = 1.55
    } else if (liftingDays >= 3) {
      multiplier = 1.45
    } else if (liftingDays >= 1) {
      multiplier = 1.35
    }

    // Adjust for steps (each 2500 steps above 5000 adds ~0.05)
    const stepBonus = Math.max(0, (dailySteps - 5000) / 2500) * 0.05
    multiplier += Math.min(stepBonus, 0.2) // Cap at +0.2

    return multiplier
  }

  const calculateMacros = (stats: UserStats): MacroTargets => {
    const bmr = calculateBMR(stats)
    const tdee = bmr * getActivityMultiplier(stats.liftingDays, stats.dailySteps)

    // Goal adjustments
    let calorieTarget: number
    const deficit = stats.aggression === 'aggressive' ? 0.25 : 0.2
    const surplus = stats.aggression === 'aggressive' ? 0.15 : 0.1

    switch (stats.goal) {
      case 'cut':
        calorieTarget = Math.round(tdee * (1 - deficit))
        // Never go below BMR * 0.8 (safety floor)
        calorieTarget = Math.max(calorieTarget, Math.round(bmr * 0.8))
        break
      case 'gain':
        calorieTarget = Math.round(tdee * (1 + surplus))
        break
      default:
        calorieTarget = Math.round(tdee)
    }

    // Protein: 2.0-2.2g per kg bodyweight (higher for cut)
    const proteinMultiplier = stats.goal === 'cut' ? 2.2 : 2.0
    const protein = Math.round(stats.weightKg * proteinMultiplier)

    // Fat: 0.8-1g per kg (minimum for hormones)
    const fat = Math.round(stats.weightKg * 0.9)

    // Carbs: remaining calories
    const proteinCals = protein * 4
    const fatCals = fat * 9
    const carbCals = calorieTarget - proteinCals - fatCals
    const carbs = Math.max(50, Math.round(carbCals / 4)) // Minimum 50g carbs

    // Fiber: 14g per 1000 calories
    const fiber = Math.round((calorieTarget / 1000) * 14)

    // Water: 35ml per kg bodyweight
    const water = Math.round((stats.weightKg * 35) / 1000 * 10) / 10

    return {
      calories: calorieTarget,
      protein,
      carbs,
      fat,
      fiber,
      water
    }
  }

  return {
    calculateBMR,
    calculateMacros
  }
}
