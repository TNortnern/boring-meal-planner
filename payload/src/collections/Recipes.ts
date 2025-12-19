import type { CollectionConfig } from 'payload'

export const Recipes: CollectionConfig = {
  slug: 'recipes',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'goalTags', 'prepTimeMinutes', 'boringScore']
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the recipe'
      }
    },
    {
      name: 'goalTags',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Cut', value: 'cut' },
        { label: 'Maintain', value: 'maintain' },
        { label: 'Gain', value: 'gain' }
      ]
    },
    {
      name: 'prepTimeMinutes',
      type: 'number',
      required: true,
      min: 1,
      max: 120,
      admin: {
        description: 'Total prep + cook time in minutes'
      }
    },
    {
      name: 'servings',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
      max: 10
    },
    {
      name: 'boringScore',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      defaultValue: 8,
      admin: {
        description: '1 = complex, 10 = ultra simple/boring'
      }
    },
    {
      name: 'ingredients',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'ingredient',
          type: 'relationship',
          relationTo: 'ingredients',
          required: true
        },
        {
          name: 'amount',
          type: 'number',
          required: true
        },
        {
          name: 'unit',
          type: 'select',
          required: true,
          options: [
            { label: 'Grams (g)', value: 'g' },
            { label: 'Ounces (oz)', value: 'oz' },
            { label: 'Cups', value: 'cups' },
            { label: 'Tablespoons (tbsp)', value: 'tbsp' },
            { label: 'Teaspoons (tsp)', value: 'tsp' },
            { label: 'Each', value: 'each' }
          ]
        },
        {
          name: 'rawWeight',
          type: 'number',
          admin: {
            description: 'Optional: raw weight in grams for accurate tracking'
          }
        }
      ]
    },
    {
      name: 'instructions',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'step',
          type: 'textarea',
          required: true
        }
      ]
    },
    {
      name: 'macrosPerServing',
      type: 'group',
      admin: {
        description: 'Calculated macros per serving'
      },
      fields: [
        { name: 'calories', type: 'number', required: true },
        { name: 'protein', type: 'number', required: true },
        { name: 'carbs', type: 'number', required: true },
        { name: 'fat', type: 'number', required: true },
        { name: 'fiber', type: 'number', defaultValue: 0 },
        { name: 'sodium', type: 'number', defaultValue: 0 }
      ]
    },
    {
      name: 'restrictions',
      type: 'group',
      fields: [
        { name: 'glutenFree', type: 'checkbox', defaultValue: false },
        { name: 'dairyFree', type: 'checkbox', defaultValue: false },
        { name: 'nutFree', type: 'checkbox', defaultValue: true },
        { name: 'eggFree', type: 'checkbox', defaultValue: false },
        { name: 'vegetarian', type: 'checkbox', defaultValue: false },
        { name: 'vegan', type: 'checkbox', defaultValue: false },
        { name: 'halal', type: 'checkbox', defaultValue: true },
        { name: 'kosher', type: 'checkbox', defaultValue: true }
      ]
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Meal Prep Friendly', value: 'meal_prep' },
        { label: 'No Oil', value: 'no_oil' },
        { label: 'Air Fryer', value: 'air_fryer' },
        { label: 'Microwave Friendly', value: 'microwave' },
        { label: 'Budget Friendly', value: 'budget' },
        { label: 'High Protein', value: 'high_protein' },
        { label: 'Low Carb', value: 'low_carb' },
        { label: 'Batch Cook', value: 'batch_cook' }
      ]
    },
    {
      name: 'proteinSource',
      type: 'select',
      options: [
        { label: 'Chicken', value: 'chicken' },
        { label: 'Turkey', value: 'turkey' },
        { label: 'Beef', value: 'beef' },
        { label: 'Fish', value: 'fish' },
        { label: 'Eggs', value: 'eggs' },
        { label: 'Tofu', value: 'tofu' },
        { label: 'Legumes', value: 'legumes' },
        { label: 'Other', value: 'other' }
      ]
    },
    {
      name: 'carbSource',
      type: 'select',
      options: [
        { label: 'Rice', value: 'rice' },
        { label: 'Potatoes', value: 'potatoes' },
        { label: 'Oats', value: 'oats' },
        { label: 'Pasta', value: 'pasta' },
        { label: 'Bread', value: 'bread' },
        { label: 'Quinoa', value: 'quinoa' },
        { label: 'None', value: 'none' }
      ]
    },
    {
      name: 'templateBase',
      type: 'text',
      admin: {
        description: 'Base template this recipe belongs to (e.g., "chicken_rice_veg")'
      }
    },
    {
      name: 'substitutions',
      type: 'array',
      admin: {
        description: 'Allowed substitutions (only shown when boring mode is OFF)'
      },
      fields: [
        {
          name: 'original',
          type: 'relationship',
          relationTo: 'ingredients'
        },
        {
          name: 'substitute',
          type: 'relationship',
          relationTo: 'ingredients'
        },
        {
          name: 'note',
          type: 'text'
        }
      ]
    }
  ]
}
