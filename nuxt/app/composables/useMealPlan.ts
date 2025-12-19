import { createSharedComposable, useLocalStorage } from '@vueuse/core'
import type { Recipe } from '~/data/recipes'

export interface MealSlot {
  slot: string // 'Meal 1', 'Meal 2', 'Meal 3'
  recipe: Recipe | null
}

export interface DayPlan {
  dayIndex: number // 0-6 for Mon-Sun
  meals: MealSlot[]
}

const _useMealPlan = () => {
  const mealPlan = useLocalStorage<DayPlan[]>('boring-meal-plan', [
    { dayIndex: 0, meals: [{ slot: 'Meal 1', recipe: null }, { slot: 'Meal 2', recipe: null }, { slot: 'Meal 3', recipe: null }] },
    { dayIndex: 1, meals: [{ slot: 'Meal 1', recipe: null }, { slot: 'Meal 2', recipe: null }, { slot: 'Meal 3', recipe: null }] },
    { dayIndex: 2, meals: [{ slot: 'Meal 1', recipe: null }, { slot: 'Meal 2', recipe: null }, { slot: 'Meal 3', recipe: null }] },
    { dayIndex: 3, meals: [{ slot: 'Meal 1', recipe: null }, { slot: 'Meal 2', recipe: null }, { slot: 'Meal 3', recipe: null }] },
    { dayIndex: 4, meals: [{ slot: 'Meal 1', recipe: null }, { slot: 'Meal 2', recipe: null }, { slot: 'Meal 3', recipe: null }] },
    { dayIndex: 5, meals: [{ slot: 'Meal 1', recipe: null }, { slot: 'Meal 2', recipe: null }, { slot: 'Meal 3', recipe: null }] },
    { dayIndex: 6, meals: [{ slot: 'Meal 1', recipe: null }, { slot: 'Meal 2', recipe: null }, { slot: 'Meal 3', recipe: null }] }
  ])

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const addRecipeToMealPlan = (recipe: Recipe, dayIndex: number, slotIndex: number) => {
    if (mealPlan.value[dayIndex] && mealPlan.value[dayIndex].meals[slotIndex]) {
      mealPlan.value[dayIndex].meals[slotIndex].recipe = recipe
    }
  }

  const removeRecipeFromMealPlan = (dayIndex: number, slotIndex: number) => {
    if (mealPlan.value[dayIndex] && mealPlan.value[dayIndex].meals[slotIndex]) {
      mealPlan.value[dayIndex].meals[slotIndex].recipe = null
    }
  }

  const swapRecipe = (recipe: Recipe, dayIndex: number, slotIndex: number) => {
    addRecipeToMealPlan(recipe, dayIndex, slotIndex)
  }

  const clearDay = (dayIndex: number) => {
    if (mealPlan.value[dayIndex]) {
      mealPlan.value[dayIndex].meals.forEach((meal) => {
        meal.recipe = null
      })
    }
  }

  const clearAllDays = () => {
    mealPlan.value.forEach((day) => {
      day.meals.forEach((meal) => {
        meal.recipe = null
      })
    })
  }

  const getDailyMacros = (dayIndex: number) => {
    const day = mealPlan.value[dayIndex]
    if (!day) return { calories: 0, protein: 0, carbs: 0, fat: 0 }

    return day.meals.reduce((acc, meal) => {
      if (meal.recipe) {
        acc.calories += meal.recipe.macros.calories
        acc.protein += meal.recipe.macros.protein
        acc.carbs += meal.recipe.macros.carbs
        acc.fat += meal.recipe.macros.fat
      }
      return acc
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
  }

  const getWeeklyMacros = computed(() => {
    return mealPlan.value.reduce((acc, day, index) => {
      const dayMacros = getDailyMacros(index)
      acc.calories += dayMacros.calories
      acc.protein += dayMacros.protein
      acc.carbs += dayMacros.carbs
      acc.fat += dayMacros.fat
      return acc
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
  })

  const getShoppingList = computed(() => {
    const ingredientMap = new Map<string, { amount: string, count: number }>()

    mealPlan.value.forEach((day) => {
      day.meals.forEach((meal) => {
        if (meal.recipe?.ingredientsList) {
          meal.recipe.ingredientsList.forEach((ingredient) => {
            const existing = ingredientMap.get(ingredient.name)
            if (existing) {
              existing.count += 1
            } else {
              ingredientMap.set(ingredient.name, { amount: ingredient.amount, count: 1 })
            }
          })
        }
      })
    })

    return Array.from(ingredientMap.entries()).map(([name, data]) => ({
      name,
      amount: data.amount,
      count: data.count
    }))
  })

  return {
    mealPlan,
    dayNames,
    addRecipeToMealPlan,
    removeRecipeFromMealPlan,
    swapRecipe,
    clearDay,
    clearAllDays,
    getDailyMacros,
    getWeeklyMacros,
    getShoppingList
  }
}

export const useMealPlan = createSharedComposable(_useMealPlan)
