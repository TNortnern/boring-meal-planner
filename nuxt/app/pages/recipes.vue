<script setup lang="ts">
import { boringRecipes, getDifficulty, type Recipe } from '~/data/recipes'
import type { RecipeData } from '~/composables/useMealPlans'

const mealPlansApi = useMealPlans()
const { isAuthenticated } = useAuth()
const toast = useToast()

// Fetch active plan on mount
onMounted(async () => {
  if (isAuthenticated.value) {
    await mealPlansApi.fetchActivePlan()
  }
})

const dayNames = ['Day A', 'Day B']

const search = ref('')
const selectedGoal = ref<string | undefined>(undefined)
const selectedProtein = ref<string | undefined>(undefined)
const selectedSource = ref<string | undefined>(undefined)
const selectedTags = ref<string[]>([])

const goalOptions = [
  { value: 'cut', label: 'Cut' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'gain', label: 'Gain' }
]

const proteinOptions = [
  { value: 'chicken', label: 'Chicken' },
  { value: 'turkey', label: 'Turkey' },
  { value: 'beef', label: 'Beef' },
  { value: 'fish', label: 'Fish' },
  { value: 'eggs', label: 'Eggs' }
]

const sourceOptions = [
  { value: 'homemade', label: 'Homemade' },
  { value: 'fast_food', label: 'Fast Food' },
  { value: 'restaurant', label: 'Restaurant' }
]

const tagOptions = [
  { value: 'meal_prep', label: 'Meal Prep' },
  { value: 'no_oil', label: 'No Oil' },
  { value: 'microwave', label: 'Microwave' },
  { value: 'budget', label: 'Budget' },
  { value: 'high_protein', label: 'High Protein' },
  { value: 'fast_food', label: 'Fast Food' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'doordash', label: 'DoorDash' }
]

// Use seeded recipes data (100 BORING recipes)
const allRecipes = ref<Recipe[]>(boringRecipes)

const filteredRecipes = computed(() => {
  return allRecipes.value.filter((recipe) => {
    // Search filter
    if (search.value && !recipe.name.toLowerCase().includes(search.value.toLowerCase())) {
      return false
    }
    // Goal filter
    if (selectedGoal.value && !recipe.goalTags.includes(selectedGoal.value as 'cut' | 'maintain' | 'gain')) {
      return false
    }
    // Protein filter
    if (selectedProtein.value && recipe.proteinSource !== selectedProtein.value) {
      return false
    }
    // Source filter
    if (selectedSource.value && recipe.source !== selectedSource.value) {
      return false
    }
    // Tags filter
    if (selectedTags.value.length > 0) {
      const hasAllTags = selectedTags.value.every(tag => recipe.tags.includes(tag))
      if (!hasAllTags) return false
    }
    return true
  })
})

const clearFilters = () => {
  search.value = ''
  selectedGoal.value = undefined
  selectedProtein.value = undefined
  selectedSource.value = undefined
  selectedTags.value = []
}

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

const selectedRecipe = ref<Recipe | null>(null)

const recipeModalOpen = computed({
  get: () => !!selectedRecipe.value,
  set: (value: boolean) => {
    if (!value) selectedRecipe.value = null
  }
})

// Get difficulty for a recipe (use existing or compute)
const getRecipeDifficulty = (recipe: Recipe) => {
  return recipe.difficulty || getDifficulty(recipe.prepTime, recipe.ingredients)
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'success'
    case 'medium': return 'warning'
    case 'hard': return 'error'
    default: return 'neutral'
  }
}

// Add to meal plan modal
const addToMealPlanOpen = ref(false)
const selectedDay = ref(0)
const selectedSlot = ref(0)

const openAddToMealPlan = () => {
  addToMealPlanOpen.value = true
}

// Get existing meal name at a slot for display
const getExistingMealName = (dayIndex: number, slotIndex: number): string | null => {
  const day = dayIndex === 0 ? 'dayA' : 'dayB'
  const meals = mealPlansApi.activePlan.value?.[day]?.meals || []
  const meal = meals[slotIndex]
  if (!meal) return null
  // Check for inline recipe data first, then relationship
  if (meal.recipeData?.name) return meal.recipeData.name
  if (typeof meal.recipe === 'object' && meal.recipe?.name) return meal.recipe.name
  return null
}

const confirmAddToMealPlan = async () => {
  if (!selectedRecipe.value) return

  if (!isAuthenticated.value) {
    toast.add({
      title: 'Login Required',
      description: 'Please log in to save meals to your plan.',
      color: 'warning'
    })
    return
  }

  // Create a default plan if none exists
  if (!mealPlansApi.activePlan.value) {
    const createResult = await mealPlansApi.createDefaultPlan()
    if (!createResult.success) {
      toast.add({
        title: 'Error',
        description: createResult.error || 'Failed to create meal plan',
        color: 'error'
      })
      return
    }
  }

  // Convert Recipe to RecipeData
  const recipeData: RecipeData = {
    id: selectedRecipe.value.id,
    name: selectedRecipe.value.name,
    description: selectedRecipe.value.description,
    prepTime: selectedRecipe.value.prepTime,
    macros: {
      calories: selectedRecipe.value.macros.calories,
      protein: selectedRecipe.value.macros.protein,
      carbs: selectedRecipe.value.macros.carbs,
      fat: selectedRecipe.value.macros.fat
    },
    ingredientsList: selectedRecipe.value.ingredientsList,
    instructions: selectedRecipe.value.instructions,
    source: selectedRecipe.value.source,
    tags: selectedRecipe.value.tags
  }

  // Add to meal plan via API
  const day = selectedDay.value === 0 ? 'dayA' : 'dayB'
  const result = await mealPlansApi.addMealWithRecipeData(day, selectedSlot.value, recipeData)

  if (result.success) {
    toast.add({
      title: 'Added to Meal Plan',
      description: `${selectedRecipe.value.name} added to ${dayNames[selectedDay.value]} - Meal ${selectedSlot.value + 1}`,
      color: 'success'
    })
    addToMealPlanOpen.value = false
    selectedRecipe.value = null
  } else {
    toast.add({
      title: 'Error',
      description: result.error || 'Failed to add meal',
      color: 'error'
    })
  }
}
</script>

<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="Recipes">
      <template #leading>
        <UDashboardSidebarToggle />
      </template>

      <template #right>
        <div class="flex items-center gap-3">
          <UInput
            v-model="search"
            placeholder="Search recipes..."
            icon="i-lucide-search"
            class="w-64"
          />
          <UColorModeButton />
        </div>
      </template>
    </UDashboardNavbar>

    <UDashboardPanelContent class="px-4 sm:px-6 lg:px-8">
      <div class="space-y-6">
        <!-- Filters -->
        <div class="flex flex-wrap gap-3 p-4 rounded-xl bg-elevated border border-default">
          <div>
            <label class="text-xs text-muted block mb-1">Goal</label>
            <USelect
              v-model="selectedGoal"
              :items="goalOptions"
              placeholder="Any"
              value-key="value"
              label-key="label"
              class="w-32"
            />
          </div>

          <div>
            <label class="text-xs text-muted block mb-1">Protein</label>
            <USelect
              v-model="selectedProtein"
              :items="proteinOptions"
              placeholder="Any"
              value-key="value"
              label-key="label"
              class="w-32"
            />
          </div>

          <div>
            <label class="text-xs text-muted block mb-1">Source</label>
            <USelect
              v-model="selectedSource"
              :items="sourceOptions"
              placeholder="Any"
              value-key="value"
              label-key="label"
              class="w-36"
            />
          </div>

          <div class="flex-1">
            <label class="text-xs text-muted block mb-1">Tags</label>
            <div class="flex flex-wrap gap-1">
              <UButton
                v-for="tag in tagOptions"
                :key="tag.value"
                :variant="selectedTags.includes(tag.value) ? 'solid' : 'outline'"
                :color="selectedTags.includes(tag.value) ? 'primary' : 'neutral'"
                size="xs"
                @click="toggleTag(tag.value)"
              >
                {{ tag.label }}
              </UButton>
            </div>
          </div>

          <div class="flex items-end">
            <UButton
              v-if="search || selectedGoal || selectedProtein || selectedSource || selectedTags.length"
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
          {{ filteredRecipes.length }} recipes found
        </div>

        <!-- Recipe grid -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="recipe in filteredRecipes"
            :key="recipe.id"
            type="button"
            class="p-4 rounded-xl bg-elevated border border-default text-left hover:border-primary transition-colors"
            @click="selectedRecipe = recipe"
          >
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-medium">
                {{ recipe.name }}
              </h3>
              <div class="flex items-center gap-1 text-xs text-muted">
                <UIcon name="i-lucide-clock" class="w-3 h-3" />
                {{ recipe.prepTime }}m
              </div>
            </div>

            <p class="text-sm text-muted mb-3 line-clamp-2">
              {{ recipe.description }}
            </p>

            <div class="flex items-center justify-between text-sm">
              <div>
                <span class="font-medium">{{ recipe.macros.calories }}</span>
                <span class="text-muted"> kcal</span>
              </div>
              <div>
                <span class="font-medium">{{ recipe.macros.protein }}g</span>
                <span class="text-muted"> protein</span>
              </div>
              <UBadge color="neutral" variant="subtle" size="xs">
                {{ recipe.ingredients }} ingredients
              </UBadge>
            </div>

            <div class="flex flex-wrap gap-1 mt-3">
              <UBadge
                v-if="recipe.source !== 'homemade'"
                :color="recipe.source === 'fast_food' ? 'warning' : 'info'"
                variant="subtle"
                size="xs"
                class="capitalize"
              >
                {{ recipe.source === 'fast_food' ? 'Fast Food' : 'Restaurant' }}
              </UBadge>
              <UBadge
                v-for="goal in recipe.goalTags"
                :key="goal"
                color="primary"
                variant="subtle"
                size="xs"
                class="capitalize"
              >
                {{ goal }}
              </UBadge>
            </div>
          </button>
        </div>

        <!-- Empty state -->
        <div
          v-if="filteredRecipes.length === 0"
          class="text-center py-12"
        >
          <UIcon name="i-lucide-search-x" class="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 class="font-medium mb-2">
            No recipes found
          </h3>
          <p class="text-sm text-muted">
            Try adjusting your filters
          </p>
        </div>
      </div>
    </UDashboardPanelContent>

    <!-- Recipe Detail Modal -->
    <UModal v-model:open="recipeModalOpen" :ui="{ content: 'sm:max-w-2xl' }">
      <template #content>
        <UCard v-if="selectedRecipe">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">
                  {{ selectedRecipe.name }}
                </h3>
                <div class="flex items-center gap-2 mt-1">
                  <UBadge
                    :color="getDifficultyColor(getRecipeDifficulty(selectedRecipe))"
                    variant="subtle"
                    size="xs"
                    class="capitalize"
                  >
                    {{ getRecipeDifficulty(selectedRecipe) }}
                  </UBadge>
                  <span class="text-sm text-muted">{{ selectedRecipe.prepTime }} min prep</span>
                  <span v-if="selectedRecipe.cookTime" class="text-sm text-muted">· {{ selectedRecipe.cookTime }} min cook</span>
                </div>
              </div>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="selectedRecipe = null"
              />
            </div>
          </template>

          <div class="space-y-5 max-h-[60vh] overflow-y-auto">
            <p class="text-muted">
              {{ selectedRecipe.description }}
            </p>

            <!-- Macros -->
            <div class="grid grid-cols-4 gap-3 p-4 rounded-lg bg-muted/30">
              <div class="text-center">
                <div class="text-lg font-bold">
                  {{ selectedRecipe.macros.calories }}
                </div>
                <div class="text-xs text-muted">
                  Calories
                </div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-blue-500">
                  {{ selectedRecipe.macros.protein }}g
                </div>
                <div class="text-xs text-muted">
                  Protein
                </div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-amber-500">
                  {{ selectedRecipe.macros.carbs }}g
                </div>
                <div class="text-xs text-muted">
                  Carbs
                </div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-rose-500">
                  {{ selectedRecipe.macros.fat }}g
                </div>
                <div class="text-xs text-muted">
                  Fat
                </div>
              </div>
            </div>

            <!-- Ingredients List -->
            <div v-if="selectedRecipe.ingredientsList && selectedRecipe.ingredientsList.length > 0">
              <h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
                <UIcon name="i-lucide-list" class="w-4 h-4 text-primary" />
                Ingredients
              </h4>
              <div class="space-y-2">
                <div
                  v-for="ingredient in selectedRecipe.ingredientsList"
                  :key="ingredient.name"
                  class="flex items-center justify-between p-2.5 rounded-lg bg-muted/20"
                >
                  <span class="font-medium text-sm">{{ ingredient.name }}</span>
                  <div class="flex items-center gap-3">
                    <span class="text-sm text-muted">{{ ingredient.amount }}</span>
                    <div v-if="ingredient.macros" class="flex items-center gap-2 text-xs">
                      <span class="text-blue-500">{{ ingredient.macros.protein }}p</span>
                      <span class="text-amber-500">{{ ingredient.macros.carbs }}c</span>
                      <span class="text-rose-500">{{ ingredient.macros.fat }}f</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="p-3 rounded-lg bg-muted/20 text-sm text-muted">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-info" class="w-4 h-4" />
                {{ selectedRecipe.ingredients }} ingredients needed
              </div>
            </div>

            <!-- Instructions -->
            <div v-if="selectedRecipe.instructions && selectedRecipe.instructions.length > 0">
              <h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
                <UIcon name="i-lucide-chef-hat" class="w-4 h-4 text-primary" />
                Instructions
              </h4>
              <ol class="space-y-2 list-decimal list-inside">
                <li
                  v-for="(step, index) in selectedRecipe.instructions"
                  :key="index"
                  class="text-sm text-muted leading-relaxed"
                >
                  {{ step }}
                </li>
              </ol>
            </div>
            <div v-else-if="selectedRecipe.source === 'fast_food' || selectedRecipe.source === 'restaurant'" class="p-3 rounded-lg bg-muted/20 text-sm text-muted">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-store" class="w-4 h-4" />
                Order from restaurant - no cooking required!
              </div>
            </div>

            <!-- Tips -->
            <div v-if="selectedRecipe.tips" class="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <h4 class="text-sm font-semibold mb-1 flex items-center gap-2">
                <UIcon name="i-lucide-lightbulb" class="w-4 h-4 text-primary" />
                Pro Tip
              </h4>
              <p class="text-sm text-muted">
                {{ selectedRecipe.tips }}
              </p>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="tag in selectedRecipe.tags"
                :key="tag"
                color="neutral"
                variant="subtle"
                class="capitalize"
              >
                {{ tag.replace('_', ' ') }}
              </UBadge>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" color="neutral" @click="selectedRecipe = null">
                Close
              </UButton>
              <UButton @click="openAddToMealPlan">
                Add to Meal Plan
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Add to Meal Plan Modal -->
    <UModal v-model:open="addToMealPlanOpen">
      <template #content>
        <UCard class="sm:min-w-[400px]">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">
                  Add to Meal Plan
                </h3>
                <p class="text-sm text-muted">
                  Choose which day and meal slot
                </p>
              </div>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="addToMealPlanOpen = false"
              />
            </div>
          </template>

          <div class="space-y-4 max-h-[60vh] overflow-y-auto">
            <!-- Selected Recipe Preview -->
            <div v-if="selectedRecipe" class="p-3 rounded-lg bg-muted/20">
              <div class="font-medium">
                {{ selectedRecipe.name }}
              </div>
              <div class="text-sm text-muted">
                {{ selectedRecipe.macros.calories }} kcal · {{ selectedRecipe.macros.protein }}g protein
              </div>
            </div>

            <!-- Day Selection -->
            <UFormField label="Day">
              <USelect
                v-model="selectedDay"
                :items="dayNames.map((name, index) => ({ value: index, label: name }))"
                value-key="value"
                label-key="label"
                class="w-full"
              />
            </UFormField>

            <!-- Meal Slot Selection -->
            <UFormField label="Meal Slot">
              <div class="space-y-2">
                <button
                  v-for="(meal, index) in ['Meal 1 (Breakfast)', 'Meal 2 (Lunch)', 'Meal 3 (Dinner)']"
                  :key="index"
                  type="button"
                  class="w-full p-3 rounded-lg text-left transition-colors"
                  :class="selectedSlot === index
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-elevated border border-default hover:border-muted'"
                  @click="selectedSlot = index"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-medium">{{ meal }}</span>
                    <span v-if="getExistingMealName(selectedDay, index)" class="text-xs text-muted">
                      Replaces: {{ getExistingMealName(selectedDay, index) }}
                    </span>
                    <span v-else class="text-xs text-muted">Empty</span>
                  </div>
                </button>
              </div>
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" color="neutral" @click="addToMealPlanOpen = false">
                Cancel
              </UButton>
              <UButton @click="confirmAddToMealPlan">
                Confirm
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </UDashboardPanel>
</template>
