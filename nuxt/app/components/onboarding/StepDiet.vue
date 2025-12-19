<script setup lang="ts">
import { boringRecipes as _boringRecipes } from '~/data/recipes'

const { state } = useOnboarding()

const allergyOptions = [
  { value: 'nuts', label: 'Nuts' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'gluten', label: 'Gluten' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'fish', label: 'Fish' },
  { value: 'shellfish', label: 'Shellfish' },
  { value: 'soy', label: 'Soy' }
]

const dietaryPatterns = [
  { value: 'none', label: 'No restrictions' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'pescatarian', label: 'Pescatarian' },
  { value: 'vegan', label: 'Vegan' }
]

// Extract unique ingredients from recipes
const commonIngredients = [
  // Protein sources
  'chicken', 'turkey', 'beef', 'fish', 'tuna', 'salmon', 'tilapia', 'cod', 'shrimp', 'eggs',
  'sardines', 'mahi mahi',
  // Grains & Starches
  'rice', 'white rice', 'brown rice', 'jasmine rice', 'quinoa', 'pasta', 'oats', 'oatmeal',
  'couscous', 'lentils', 'noodles', 'crackers', 'bread', 'toast', 'tortilla',
  // Vegetables
  'broccoli', 'asparagus', 'green beans', 'spinach', 'peppers', 'bell peppers', 'onions',
  'zucchini', 'cauliflower', 'lettuce', 'romaine', 'mixed greens', 'peas', 'carrots',
  'corn', 'tomatoes', 'cucumber', 'mushrooms',
  // Beans & Legumes
  'beans', 'black beans',
  // Other
  'potato', 'sweet potato', 'avocado', 'peanut butter', 'cottage cheese', 'greek yogurt',
  'cheese', 'mayo', 'soy sauce', 'teriyaki sauce', 'bbq sauce', 'salsa', 'marinara'
].sort()

const ingredientOptions = computed(() => {
  return commonIngredients.map(ingredient => ({
    label: ingredient.charAt(0).toUpperCase() + ingredient.slice(1),
    value: ingredient
  }))
})

const toggleAllergy = (allergy: string) => {
  const index = state.value.allergies.indexOf(allergy)
  if (index === -1) {
    state.value.allergies.push(allergy)
  } else {
    state.value.allergies.splice(index, 1)
  }
}

const selectedIngredient = ref<{ label: string, value: string } | undefined>(undefined)

const addExcludedFood = (item: { label: string, value: string } | string) => {
  const food = typeof item === 'string' ? item.trim().toLowerCase() : item.value.toLowerCase()
  if (food && !state.value.excludedFoods.includes(food)) {
    state.value.excludedFoods.push(food)
    selectedIngredient.value = undefined
  }
}

const removeExcludedFood = (food: string) => {
  const index = state.value.excludedFoods.indexOf(food)
  if (index !== -1) {
    state.value.excludedFoods.splice(index, 1)
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Allergies -->
    <div class="space-y-3">
      <label class="text-sm font-medium">Food allergies</label>
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="allergy in allergyOptions"
          :key="allergy.value"
          :variant="state.allergies.includes(allergy.value) ? 'solid' : 'outline'"
          :color="state.allergies.includes(allergy.value) ? 'primary' : 'neutral'"
          size="sm"
          @click="toggleAllergy(allergy.value)"
        >
          {{ allergy.label }}
        </UButton>
      </div>
    </div>

    <!-- Dietary pattern -->
    <div class="space-y-3">
      <label class="text-sm font-medium">Dietary pattern</label>
      <USelect
        v-model="state.dietaryPattern"
        :items="dietaryPatterns"
        value-key="value"
        label-key="label"
      />
    </div>

    <!-- Excluded foods -->
    <div class="space-y-3">
      <label class="text-sm font-medium">Foods to exclude</label>
      <UInputMenu
        v-model="selectedIngredient"
        :items="ingredientOptions"
        placeholder="Search for foods to exclude..."
        searchable
        @update:model-value="(value: any) => value && addExcludedFood(value)"
      />
      <div v-if="state.excludedFoods.length" class="flex flex-wrap gap-2">
        <UBadge
          v-for="food in state.excludedFoods"
          :key="food"
          color="neutral"
          variant="subtle"
          class="capitalize"
        >
          {{ food }}
          <button
            type="button"
            class="ml-1 hover:text-error"
            @click="removeExcludedFood(food)"
          >
            <UIcon name="i-lucide-x" class="w-3 h-3" />
          </button>
        </UBadge>
      </div>
      <p class="text-xs text-muted">
        Search and select foods you don't want in your meal plan.
      </p>
    </div>
  </div>
</template>
