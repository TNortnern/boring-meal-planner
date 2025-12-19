import { describe, it, expect } from 'vitest'

describe('Example test suite', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should validate macro calculations', () => {
    const calculateCalories = (protein: number, carbs: number, fat: number) => {
      return (protein * 4) + (carbs * 4) + (fat * 9)
    }

    // 150g protein, 200g carbs, 50g fat
    const calories = calculateCalories(150, 200, 50)
    expect(calories).toBe(1850)
  })
})
