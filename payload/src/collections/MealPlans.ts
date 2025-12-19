import type { CollectionConfig } from 'payload'

export const MealPlans: CollectionConfig = {
  slug: 'meal-plans',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'user', 'weekStartDate', 'rotationType']
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g., "Week of Dec 16, 2024"'
      }
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true
    },
    {
      name: 'weekStartDate',
      type: 'date',
      required: true
    },
    {
      name: 'rotationType',
      type: 'select',
      required: true,
      defaultValue: 'same_daily',
      options: [
        { label: 'Same Every Day', value: 'same_daily' },
        { label: 'A/B Rotation', value: 'ab_rotation' },
        { label: 'Custom', value: 'custom' }
      ]
    },
    {
      name: 'macroTargets',
      type: 'group',
      fields: [
        { name: 'calories', type: 'number', required: true },
        { name: 'protein', type: 'number', required: true },
        { name: 'carbs', type: 'number', required: true },
        { name: 'fat', type: 'number', required: true }
      ]
    },
    {
      name: 'dayA',
      type: 'group',
      admin: {
        description: 'Day A meals (or default if same daily)'
      },
      fields: [
        {
          name: 'meals',
          type: 'array',
          fields: [
            {
              name: 'slot',
              type: 'select',
              required: true,
              options: [
                { label: 'Meal 1', value: 'meal_1' },
                { label: 'Meal 2', value: 'meal_2' },
                { label: 'Meal 3', value: 'meal_3' },
                { label: 'Meal 4', value: 'meal_4' },
                { label: 'Meal 5', value: 'meal_5' }
              ]
            },
            {
              name: 'recipe',
              type: 'relationship',
              relationTo: 'recipes',
              required: true
            },
            {
              name: 'portionMultiplier',
              type: 'number',
              defaultValue: 1,
              admin: {
                description: 'Multiply recipe servings by this amount'
              }
            }
          ]
        }
      ]
    },
    {
      name: 'dayB',
      type: 'group',
      admin: {
        description: 'Day B meals (only used for A/B rotation)',
        condition: (data) => data.rotationType === 'ab_rotation'
      },
      fields: [
        {
          name: 'meals',
          type: 'array',
          fields: [
            {
              name: 'slot',
              type: 'select',
              required: true,
              options: [
                { label: 'Meal 1', value: 'meal_1' },
                { label: 'Meal 2', value: 'meal_2' },
                { label: 'Meal 3', value: 'meal_3' },
                { label: 'Meal 4', value: 'meal_4' },
                { label: 'Meal 5', value: 'meal_5' }
              ]
            },
            {
              name: 'recipe',
              type: 'relationship',
              relationTo: 'recipes',
              required: true
            },
            {
              name: 'portionMultiplier',
              type: 'number',
              defaultValue: 1
            }
          ]
        }
      ]
    },
    {
      name: 'customDays',
      type: 'array',
      admin: {
        description: 'Custom meals per day (only used for custom rotation)',
        condition: (data) => data.rotationType === 'custom'
      },
      fields: [
        {
          name: 'dayOfWeek',
          type: 'select',
          required: true,
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' }
          ]
        },
        {
          name: 'meals',
          type: 'array',
          fields: [
            {
              name: 'slot',
              type: 'select',
              required: true,
              options: [
                { label: 'Meal 1', value: 'meal_1' },
                { label: 'Meal 2', value: 'meal_2' },
                { label: 'Meal 3', value: 'meal_3' },
                { label: 'Meal 4', value: 'meal_4' },
                { label: 'Meal 5', value: 'meal_5' }
              ]
            },
            {
              name: 'recipe',
              type: 'relationship',
              relationTo: 'recipes',
              required: true
            },
            {
              name: 'portionMultiplier',
              type: 'number',
              defaultValue: 1
            }
          ]
        }
      ]
    },
    {
      name: 'shoppingList',
      type: 'array',
      admin: {
        description: 'Auto-generated shopping list'
      },
      fields: [
        {
          name: 'ingredient',
          type: 'relationship',
          relationTo: 'ingredients'
        },
        {
          name: 'totalAmount',
          type: 'number'
        },
        {
          name: 'unit',
          type: 'text'
        }
      ]
    },
    {
      name: 'mealPrepInstructions',
      type: 'textarea',
      admin: {
        description: 'Auto-generated meal prep guide'
      }
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true
    }
  ]
}
