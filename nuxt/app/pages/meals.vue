<script setup lang="ts">
import { format, addDays, startOfWeek } from 'date-fns'

const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })

const rotationType = ref<'same_daily' | 'ab_rotation'>('same_daily')

const days = computed(() => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i)
    return {
      date,
      dayName: format(date, 'EEEE'),
      shortName: format(date, 'EEE'),
      dateStr: format(date, 'MMM d'),
      isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
      rotation: rotationType.value === 'ab_rotation' ? (i % 2 === 0 ? 'A' : 'B') : null
    }
  })
})

// Mock meal plan data
const mealPlan = ref({
  dayA: [
    {
      slot: 'Meal 1',
      recipe: 'Chicken & Rice Bowl',
      macros: { calories: 550, protein: 45 },
      ingredients: [
        { name: 'Chicken Breast', amount: '6 oz', macros: { protein: 42, carbs: 0, fat: 3 } },
        { name: 'White Rice', amount: '1 cup cooked', macros: { protein: 3, carbs: 45, fat: 0 } },
        { name: 'Broccoli', amount: '1 cup', macros: { protein: 0, carbs: 10, fat: 0 } },
        { name: 'Olive Oil', amount: '1 tsp', macros: { protein: 0, carbs: 0, fat: 12 } }
      ],
      instructions: 'Season chicken with salt and pepper. Cook in a pan over medium heat for 6-7 minutes per side. Microwave rice according to package. Steam broccoli for 4 minutes. Combine all in a bowl and drizzle with olive oil.'
    },
    {
      slot: 'Meal 2',
      recipe: 'Turkey & Potato Plate',
      macros: { calories: 600, protein: 50 },
      ingredients: [
        { name: 'Ground Turkey', amount: '6 oz', macros: { protein: 48, carbs: 0, fat: 8 } },
        { name: 'Sweet Potato', amount: '1 medium', macros: { protein: 2, carbs: 50, fat: 0 } },
        { name: 'Green Beans', amount: '1 cup', macros: { protein: 0, carbs: 10, fat: 0 } },
        { name: 'Butter', amount: '1 tbsp', macros: { protein: 0, carbs: 0, fat: 10 } }
      ],
      instructions: 'Brown turkey in a skillet, season with garlic powder and onion powder. Microwave sweet potato for 8-10 minutes until soft. Steam green beans. Top potato with butter and serve alongside turkey and beans.'
    },
    {
      slot: 'Meal 3',
      recipe: 'Lean Beef Stir-Fry',
      macros: { calories: 650, protein: 55 },
      ingredients: [
        { name: 'Lean Ground Beef', amount: '6 oz', macros: { protein: 50, carbs: 0, fat: 15 } },
        { name: 'Jasmine Rice', amount: '1 cup cooked', macros: { protein: 4, carbs: 45, fat: 0 } },
        { name: 'Mixed Vegetables', amount: '1.5 cups', macros: { protein: 1, carbs: 10, fat: 0 } },
        { name: 'Sesame Oil', amount: '1 tsp', macros: { protein: 0, carbs: 0, fat: 7 } }
      ],
      instructions: 'Cook beef in a wok or large pan until browned. Add frozen mixed vegetables and stir-fry for 5-7 minutes. Add cooked rice and sesame oil, stir to combine. Season with soy sauce to taste.'
    }
  ],
  dayB: [
    {
      slot: 'Meal 1',
      recipe: 'Egg White Omelette',
      macros: { calories: 500, protein: 42 },
      ingredients: [
        { name: 'Egg Whites', amount: '8 whites', macros: { protein: 28, carbs: 2, fat: 0 } },
        { name: 'Whole Eggs', amount: '2 eggs', macros: { protein: 12, carbs: 0, fat: 10 } },
        { name: 'Oats', amount: '1/2 cup dry', macros: { protein: 5, carbs: 27, fat: 3 } },
        { name: 'Berries', amount: '1/2 cup', macros: { protein: 0, carbs: 15, fat: 0 } }
      ],
      instructions: 'Whisk eggs and egg whites together. Cook in a non-stick pan until set. Cook oats with water in microwave for 2-3 minutes. Top oats with berries.'
    },
    {
      slot: 'Meal 2',
      recipe: 'Tuna Rice Bowl',
      macros: { calories: 580, protein: 48 },
      ingredients: [
        { name: 'Canned Tuna', amount: '1 can (5oz)', macros: { protein: 42, carbs: 0, fat: 1 } },
        { name: 'Brown Rice', amount: '1 cup cooked', macros: { protein: 5, carbs: 45, fat: 2 } },
        { name: 'Avocado', amount: '1/4 medium', macros: { protein: 1, carbs: 4, fat: 7 } },
        { name: 'Cucumber', amount: '1/2 cup', macros: { protein: 0, carbs: 4, fat: 0 } }
      ],
      instructions: 'Drain tuna and mix with a little mayo or Greek yogurt. Microwave rice. Assemble bowl with rice, tuna, sliced avocado, and cucumber. Season with soy sauce.'
    },
    {
      slot: 'Meal 3',
      recipe: 'Chicken Stir-Fry',
      macros: { calories: 620, protein: 52 },
      ingredients: [
        { name: 'Chicken Thighs', amount: '6 oz', macros: { protein: 46, carbs: 0, fat: 12 } },
        { name: 'White Rice', amount: '1 cup cooked', macros: { protein: 3, carbs: 45, fat: 0 } },
        { name: 'Bell Peppers', amount: '1 cup', macros: { protein: 1, carbs: 9, fat: 0 } },
        { name: 'Cooking Oil', amount: '1 tbsp', macros: { protein: 0, carbs: 0, fat: 14 } }
      ],
      instructions: 'Cut chicken into bite-sized pieces. Heat oil in wok, cook chicken until done. Add sliced peppers and stir-fry for 3-4 minutes. Serve over rice with teriyaki sauce.'
    }
  ]
})

const expandedMealSlot = ref<string | null>(null)

const toggleMealExpanded = (slot: string) => {
  expandedMealSlot.value = expandedMealSlot.value === slot ? null : slot
}

const getMealsForDay = (dayIndex: number) => {
  if (rotationType.value === 'same_daily') {
    return mealPlan.value.dayA
  }
  return dayIndex % 2 === 0 ? mealPlan.value.dayA : mealPlan.value.dayB
}

const totalDailyMacros = computed(() => {
  const meals = mealPlan.value.dayA
  return {
    calories: meals.reduce((sum, m) => sum + m.macros.calories, 0),
    protein: meals.reduce((sum, m) => sum + m.macros.protein, 0)
  }
})

const selectedDay = ref(0)

const currentDay = computed(() => days.value[selectedDay.value])

const shoppingListOpen = ref(false)

// Mock shopping list with categories
const shoppingList = ref([
  { ingredient: 'Chicken Breast', amount: '2.5', unit: 'lbs', category: 'Proteins', purchased: false },
  { ingredient: 'Ground Turkey', amount: '1.5', unit: 'lbs', category: 'Proteins', purchased: false },
  { ingredient: 'Lean Ground Beef', amount: '1', unit: 'lb', category: 'Proteins', purchased: false },
  { ingredient: 'Eggs', amount: '1', unit: 'dozen', category: 'Proteins', purchased: false },
  { ingredient: 'White Rice', amount: '3', unit: 'cups', category: 'Carbs', purchased: false },
  { ingredient: 'Potatoes', amount: '4', unit: 'lbs', category: 'Carbs', purchased: false },
  { ingredient: 'Broccoli', amount: '2', unit: 'heads', category: 'Vegetables', purchased: false },
  { ingredient: 'Mixed Vegetables', amount: '2', unit: 'bags', category: 'Vegetables', purchased: false },
  { ingredient: 'Olive Oil', amount: '1', unit: 'bottle', category: 'Fats & Oils', purchased: false }
])

const groupedShoppingList = computed(() => {
  const groups: Record<string, typeof shoppingList.value> = {}
  shoppingList.value.forEach((item) => {
    if (!groups[item.category]) {
      groups[item.category] = []
    }
    groups[item.category]!.push(item)
  })
  return groups
})

const togglePurchased = (ingredient: string) => {
  const item = shoppingList.value.find(i => i.ingredient === ingredient)
  if (item) {
    item.purchased = !item.purchased
  }
}

const copyShoppingList = async () => {
  const text = Object.entries(groupedShoppingList.value)
    .map(([category, items]) => {
      const itemList = items
        .map(item => `  • ${item.ingredient} - ${item.amount} ${item.unit}`)
        .join('\n')
      return `${category}:\n${itemList}`
    })
    .join('\n\n')

  try {
    await navigator.clipboard.writeText(text)
    // You could add a toast notification here
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="Meal Plan">
      <template #leading>
        <UDashboardSidebarToggle />
      </template>

      <template #right>
        <div class="flex items-center gap-3">
          <UButton
            variant="outline"
            color="neutral"
            icon="i-lucide-shopping-cart"
            @click="shoppingListOpen = true"
          >
            Shopping List
          </UButton>
          <UColorModeButton />
        </div>
      </template>
    </UDashboardNavbar>

    <UDashboardPanelContent class="px-4 sm:px-6 lg:px-8">
      <div class="space-y-6">
        <!-- Rotation type toggle -->
        <div class="flex items-center justify-between p-4 rounded-xl bg-elevated border border-default">
          <div>
            <h3 class="font-medium">
              Meal Rotation
            </h3>
            <p class="text-sm text-muted">
              {{ rotationType === 'same_daily' ? 'Same boring meals every day' : 'Alternating A/B days' }}
            </p>
          </div>
          <UButtonGroup>
            <UButton
              :variant="rotationType === 'same_daily' ? 'solid' : 'outline'"
              :color="rotationType === 'same_daily' ? 'primary' : 'neutral'"
              size="sm"
              @click="rotationType = 'same_daily'"
            >
              Same Daily
            </UButton>
            <UButton
              :variant="rotationType === 'ab_rotation' ? 'solid' : 'outline'"
              :color="rotationType === 'ab_rotation' ? 'primary' : 'neutral'"
              size="sm"
              @click="rotationType = 'ab_rotation'"
            >
              A/B Rotation
            </UButton>
          </UButtonGroup>
        </div>

        <!-- Week view -->
        <div class="grid grid-cols-7 gap-2">
          <button
            v-for="(day, index) in days"
            :key="day.dateStr"
            type="button"
            class="p-3 rounded-lg text-center transition-all"
            :class="[
              selectedDay === index
                ? 'bg-primary text-white'
                : day.isToday
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-elevated border border-default hover:border-muted'
            ]"
            @click="selectedDay = index"
          >
            <div class="text-xs font-medium">
              {{ day.shortName }}
            </div>
            <div class="text-lg font-bold">
              {{ day.dateStr.split(' ')[1] }}
            </div>
            <UBadge
              v-if="day.rotation"
              :color="day.rotation === 'A' ? 'primary' : 'neutral'"
              variant="subtle"
              size="xs"
              class="mt-1"
            >
              Day {{ day.rotation }}
            </UBadge>
          </button>
        </div>

        <!-- Selected day meals -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 v-if="currentDay" class="text-lg font-semibold">
              {{ currentDay.dayName }}
              <span v-if="currentDay.rotation" class="text-muted font-normal">
                — Day {{ currentDay.rotation }}
              </span>
            </h2>
            <div class="text-sm text-muted">
              {{ totalDailyMacros.calories }} kcal · {{ totalDailyMacros.protein }}g protein
            </div>
          </div>

          <div class="space-y-3">
            <div
              v-for="meal in getMealsForDay(selectedDay)"
              :key="meal.slot"
              class="rounded-xl bg-elevated border border-default overflow-hidden"
            >
              <!-- Meal Header (Clickable) -->
              <button
                type="button"
                class="w-full p-4 flex items-center gap-4 hover:bg-muted/10 transition-colors"
                @click="toggleMealExpanded(meal.slot)"
              >
                <div class="flex-1 text-left">
                  <div class="text-xs text-muted mb-1">
                    {{ meal.slot }}
                  </div>
                  <div class="font-medium">
                    {{ meal.recipe }}
                  </div>
                </div>
                <div class="flex-shrink-0 text-right text-sm">
                  <div class="font-medium">
                    {{ meal.macros.calories }} kcal
                  </div>
                  <div class="text-muted">
                    {{ meal.macros.protein }}g protein
                  </div>
                </div>
                <UIcon
                  :name="expandedMealSlot === meal.slot ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  class="w-5 h-5 text-muted flex-shrink-0"
                />
              </button>

              <!-- Expanded Content -->
              <div
                v-if="expandedMealSlot === meal.slot"
                class="px-4 pb-4 space-y-4 border-t border-default"
              >
                <!-- Ingredients -->
                <div class="pt-4">
                  <h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
                    <UIcon name="i-lucide-list" class="w-4 h-4 text-primary" />
                    Ingredients
                  </h4>
                  <div class="space-y-2">
                    <div
                      v-for="ingredient in meal.ingredients"
                      :key="ingredient.name"
                      class="flex items-center justify-between p-2.5 rounded-lg bg-muted/20"
                    >
                      <div class="flex-1">
                        <span class="font-medium text-sm">{{ ingredient.name }}</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <span class="text-sm text-muted">{{ ingredient.amount }}</span>
                        <div class="flex items-center gap-2 text-xs">
                          <span class="text-blue-500">{{ ingredient.macros.protein }}p</span>
                          <span class="text-amber-500">{{ ingredient.macros.carbs }}c</span>
                          <span class="text-rose-500">{{ ingredient.macros.fat }}f</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Instructions -->
                <div>
                  <h4 class="text-sm font-semibold mb-2 flex items-center gap-2">
                    <UIcon name="i-lucide-chef-hat" class="w-4 h-4 text-primary" />
                    Preparation
                  </h4>
                  <p class="text-sm text-muted leading-relaxed">
                    {{ meal.instructions }}
                  </p>
                </div>

                <!-- Actions -->
                <div class="flex gap-2 pt-2">
                  <UButton
                    variant="outline"
                    color="neutral"
                    size="sm"
                    icon="i-lucide-repeat"
                  >
                    Swap Meal
                  </UButton>
                  <UButton
                    variant="ghost"
                    color="neutral"
                    size="sm"
                    icon="i-lucide-pencil"
                  >
                    Edit
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Meal prep instructions -->
        <div class="p-4 rounded-xl bg-muted/30 border border-default">
          <h3 class="font-medium mb-2 flex items-center gap-2">
            <UIcon name="i-lucide-chef-hat" class="w-5 h-5 text-primary" />
            Meal Prep Guide
          </h3>
          <p class="text-sm text-muted">
            Cook all proteins on Sunday. Portion into {{ rotationType === 'ab_rotation' ? '14' : '7' }} containers.
            Rice and vegetables can be prepped 3 days at a time for freshness.
          </p>
        </div>

        <!-- BORING mode indicator -->
        <div class="flex items-center justify-center gap-2 py-3 text-sm text-muted">
          <UIcon name="i-lucide-lock" class="w-4 h-4" />
          <span>BORING Mode — Limited variety for maximum consistency</span>
        </div>
      </div>
    </UDashboardPanelContent>

    <!-- Shopping List Slideover -->
    <USlideover v-model:open="shoppingListOpen">
      <template #content>
        <UDashboardSlideover
          title="Shopping List"
          description="Weekly grocery list based on your meal plan"
          @close="shoppingListOpen = false"
        >
          <div class="space-y-6">
            <!-- Category Groups -->
            <div
              v-for="(items, category) in groupedShoppingList"
              :key="category"
              class="space-y-3"
            >
              <div class="flex items-center gap-2 pb-2 border-b border-default">
                <UIcon
                  :name="category === 'Proteins' ? 'i-lucide-beef' : category === 'Carbs' ? 'i-lucide-wheat' : category === 'Vegetables' ? 'i-lucide-leaf' : 'i-lucide-droplet'"
                  class="w-4 h-4 text-primary"
                />
                <h3 class="font-semibold text-sm uppercase tracking-wide text-muted">
                  {{ category }}
                </h3>
              </div>

              <div class="space-y-2">
                <button
                  v-for="item in items"
                  :key="item.ingredient"
                  type="button"
                  class="w-full flex items-center gap-3 p-3 rounded-xl bg-elevated border border-default hover:border-primary transition-all group"
                  :class="{ 'opacity-50': item.purchased }"
                  @click="togglePurchased(item.ingredient)"
                >
                  <!-- Checkbox -->
                  <div
                    class="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                    :class="item.purchased
                      ? 'bg-primary border-primary'
                      : 'border-muted group-hover:border-primary'"
                  >
                    <UIcon
                      v-if="item.purchased"
                      name="i-lucide-check"
                      class="w-3.5 h-3.5 text-white"
                    />
                  </div>

                  <!-- Item details -->
                  <div class="flex-1 text-left min-w-0">
                    <div
                      class="font-medium transition-all"
                      :class="{ 'line-through': item.purchased }"
                    >
                      {{ item.ingredient }}
                    </div>
                  </div>

                  <!-- Quantity -->
                  <div class="flex-shrink-0">
                    <div class="px-2.5 py-1 rounded-md bg-muted/30">
                      <span class="text-sm font-medium">{{ item.amount }}</span>
                      <span class="text-xs text-muted ml-1">{{ item.unit }}</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Summary -->
            <div class="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted">Progress</span>
                <span class="font-medium">
                  {{ shoppingList.filter(i => i.purchased).length }} / {{ shoppingList.length }} items
                </span>
              </div>
              <UProgress
                :model-value="(shoppingList.filter(i => i.purchased).length / shoppingList.length) * 100"
                size="sm"
                class="mt-2"
              />
            </div>
          </div>

          <template #footer>
            <div class="space-y-2">
              <UButton
                block
                icon="i-lucide-copy"
                @click="copyShoppingList"
              >
                Copy to Clipboard
              </UButton>
              <UButton
                variant="outline"
                color="neutral"
                block
                icon="i-lucide-rotate-ccw"
                @click="shoppingList.forEach(i => i.purchased = false)"
              >
                Reset All
              </UButton>
            </div>
          </template>
        </UDashboardSlideover>
      </template>
    </USlideover>
  </UDashboardPanel>
</template>
