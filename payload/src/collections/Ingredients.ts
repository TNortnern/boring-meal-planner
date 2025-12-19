import type { CollectionConfig } from 'payload'

export const Ingredients: CollectionConfig = {
  slug: 'ingredients',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'caloriesPer100g', 'proteinPer100g']
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Protein', value: 'protein' },
        { label: 'Carbohydrate', value: 'carb' },
        { label: 'Vegetable', value: 'vegetable' },
        { label: 'Fruit', value: 'fruit' },
        { label: 'Fat/Oil', value: 'fat' },
        { label: 'Dairy', value: 'dairy' },
        { label: 'Seasoning', value: 'seasoning' },
        { label: 'Other', value: 'other' }
      ]
    },
    {
      name: 'defaultUnit',
      type: 'select',
      required: true,
      defaultValue: 'g',
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
      name: 'macrosPer100g',
      type: 'group',
      admin: {
        description: 'Macros per 100g of ingredient'
      },
      fields: [
        { name: 'calories', type: 'number', required: true },
        { name: 'protein', type: 'number', required: true },
        { name: 'carbs', type: 'number', required: true },
        { name: 'fat', type: 'number', required: true },
        { name: 'fiber', type: 'number', defaultValue: 0 },
        { name: 'sodium', type: 'number', defaultValue: 0, admin: { description: 'mg' } }
      ]
    },
    {
      name: 'restrictions',
      type: 'group',
      fields: [
        { name: 'glutenFree', type: 'checkbox', defaultValue: true },
        { name: 'dairyFree', type: 'checkbox', defaultValue: true },
        { name: 'nutFree', type: 'checkbox', defaultValue: true },
        { name: 'eggFree', type: 'checkbox', defaultValue: true },
        { name: 'vegetarian', type: 'checkbox', defaultValue: false },
        { name: 'vegan', type: 'checkbox', defaultValue: false },
        { name: 'halal', type: 'checkbox', defaultValue: true },
        { name: 'kosher', type: 'checkbox', defaultValue: true }
      ]
    },
    {
      name: 'aliases',
      type: 'array',
      admin: {
        description: 'Alternative names for this ingredient'
      },
      fields: [
        { name: 'name', type: 'text' }
      ]
    }
  ]
}
