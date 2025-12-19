import { describe, it, expect } from 'vitest'
import { useMacroCalculator, type UserStats } from '../../app/composables/useMacroCalculator'

describe('useMacroCalculator', () => {
  const { calculateMacros } = useMacroCalculator()

  const baseStats: UserStats = {
    sex: 'male',
    age: 30,
    heightCm: 180,
    weightKg: 80,
    liftingDays: 4,
    dailySteps: 8000,
    goal: 'maintain',
    aggression: 'safe'
  }

  describe('calculateMacros', () => {
    it('returns higher calories for gain goal', () => {
      const maintain = calculateMacros({ ...baseStats, goal: 'maintain' })
      const gain = calculateMacros({ ...baseStats, goal: 'gain' })

      expect(gain.calories).toBeGreaterThan(maintain.calories)
    })

    it('returns lower calories for cut goal', () => {
      const maintain = calculateMacros({ ...baseStats, goal: 'maintain' })
      const cut = calculateMacros({ ...baseStats, goal: 'cut' })

      expect(cut.calories).toBeLessThan(maintain.calories)
    })

    it('returns higher protein for cut goal', () => {
      const maintain = calculateMacros({ ...baseStats, goal: 'maintain' })
      const cut = calculateMacros({ ...baseStats, goal: 'cut' })

      // Protein should be higher per kg bodyweight during a cut
      expect(cut.protein / baseStats.weightKg).toBeGreaterThanOrEqual(maintain.protein / baseStats.weightKg)
    })

    it('aggressive cut has larger deficit than safe cut', () => {
      const safeCut = calculateMacros({ ...baseStats, goal: 'cut', aggression: 'safe' })
      const aggressiveCut = calculateMacros({ ...baseStats, goal: 'cut', aggression: 'aggressive' })

      expect(aggressiveCut.calories).toBeLessThan(safeCut.calories)
    })

    it('returns minimum 50g carbs even in aggressive deficit', () => {
      const extremeCut = calculateMacros({
        ...baseStats,
        goal: 'cut',
        aggression: 'aggressive',
        weightKg: 60 // Lower weight = lower calorie needs
      })

      expect(extremeCut.carbs).toBeGreaterThanOrEqual(50)
    })

    it('calculates correct protein based on bodyweight', () => {
      const result = calculateMacros(baseStats)

      // Protein should be ~2g per kg for maintain
      expect(result.protein).toBeCloseTo(baseStats.weightKg * 2, -1)
    })

    it('returns sensible fiber recommendations', () => {
      const result = calculateMacros(baseStats)

      // Fiber should be ~14g per 1000 calories
      const expectedFiber = Math.round((result.calories / 1000) * 14)
      expect(result.fiber).toBe(expectedFiber)
    })

    it('returns sensible water recommendations', () => {
      const result = calculateMacros(baseStats)

      // Water should be ~35ml per kg
      const expectedWater = Math.round((baseStats.weightKg * 35) / 1000 * 10) / 10
      expect(result.water).toBe(expectedWater)
    })

    it('adjusts calories based on activity level', () => {
      const sedentary = calculateMacros({ ...baseStats, liftingDays: 0, dailySteps: 3000 })
      const active = calculateMacros({ ...baseStats, liftingDays: 5, dailySteps: 12000 })

      expect(active.calories).toBeGreaterThan(sedentary.calories)
    })

    it('handles female sex correctly', () => {
      const male = calculateMacros({ ...baseStats, sex: 'male' })
      const female = calculateMacros({ ...baseStats, sex: 'female' })

      // Female BMR is typically lower due to Mifflin-St Jeor formula
      expect(female.calories).toBeLessThan(male.calories)
    })
  })
})
