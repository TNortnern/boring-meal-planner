import type { MacroTargets } from './useMacroCalculator'
import { boringRecipes } from '~/data/recipes'

interface GeneratedMeal {
  slot: string
  recipe: string
  macros: { calories: number, protein: number }
  ingredients: Array<{
    name: string
    amount: string
    macros?: { protein: number, carbs: number, fat: number }
  }>
  instructions: string
}

export interface GeneratedMealPlan {
  dayA: GeneratedMeal[]
  dayB: GeneratedMeal[]
}

/**
 * Generate a meal plan that matches user's macro targets
 */
export function useMealPlanGenerator() {
  /**
   * Generate 3 meals that approximately match the target macros
   */
  const generateDailyMeals = (targets: MacroTargets, dayType: 'A' | 'B'): GeneratedMeal[] => {
    // Target macros per meal (divide by 3 meals)
    const caloriesPerMeal = Math.round(targets.calories / 3)
    const proteinPerMeal = Math.round(targets.protein / 3)

    // Get all homemade recipes sorted by how well they match the target
    const homemadeRecipes = boringRecipes.filter(r => r.source === 'homemade')

    // Score each recipe by how close it is to the target
    const scoredRecipes = homemadeRecipes.map((recipe) => {
      const calorieDiff = Math.abs(recipe.macros.calories - caloriesPerMeal)
      const proteinDiff = Math.abs(recipe.macros.protein - proteinPerMeal)
      const score = calorieDiff + proteinDiff * 2 // Weight protein higher
      return { recipe, score }
    })

    // Sort by best match
    scoredRecipes.sort((a, b) => a.score - b.score)

    // Pick 3 different recipes
    const selectedRecipes = []
    const usedIds = new Set<number>()

    // Offset for Day B to get different meals
    const startOffset = dayType === 'B' ? 3 : 0

    for (let i = 0; i < 3 && i < scoredRecipes.length; i++) {
      const candidateIndex = (startOffset + i) % scoredRecipes.length
      let candidate = scoredRecipes[candidateIndex]

      // Make sure we don't use the same recipe twice
      let attempts = 0
      while (candidate && usedIds.has(candidate.recipe.id) && attempts < scoredRecipes.length) {
        const nextIndex = (candidateIndex + attempts + 1) % scoredRecipes.length
        candidate = scoredRecipes[nextIndex]
        attempts++
      }

      if (candidate && !usedIds.has(candidate.recipe.id)) {
        selectedRecipes.push(candidate.recipe)
        usedIds.add(candidate.recipe.id)
      }
    }

    // If we don't have 3 meals, fill with the best remaining ones
    while (selectedRecipes.length < 3) {
      const remaining = scoredRecipes.find(s => !usedIds.has(s.recipe.id))
      if (remaining) {
        selectedRecipes.push(remaining.recipe)
        usedIds.add(remaining.recipe.id)
      } else {
        break
      }
    }

    return selectedRecipes.map((recipe, index) => ({
      slot: `Meal ${index + 1}`,
      recipe: recipe.name,
      macros: {
        calories: recipe.macros.calories,
        protein: recipe.macros.protein
      },
      ingredients: recipe.ingredientsList || [],
      instructions: recipe.instructions?.join(' ') || recipe.description
    }))
  }

  /**
   * Generate a full week meal plan (with A/B rotation option)
   */
  const generateMealPlan = (targets: MacroTargets): GeneratedMealPlan => {
    return {
      dayA: generateDailyMeals(targets, 'A'),
      dayB: generateDailyMeals(targets, 'B')
    }
  }

  return {
    generateDailyMeals,
    generateMealPlan
  }
}
