import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email'
  },
  fields: [
    {
      name: 'name',
      type: 'text'
    },
    {
      name: 'sex',
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Prefer not to say', value: 'unspecified' }
      ]
    },
    {
      name: 'age',
      type: 'number',
      min: 13,
      max: 120
    },
    {
      name: 'height',
      type: 'group',
      fields: [
        { name: 'value', type: 'number', required: true },
        {
          name: 'unit',
          type: 'select',
          defaultValue: 'cm',
          options: [
            { label: 'cm', value: 'cm' },
            { label: 'inches', value: 'in' }
          ]
        }
      ]
    },
    {
      name: 'currentWeight',
      type: 'group',
      fields: [
        { name: 'value', type: 'number', required: true },
        {
          name: 'unit',
          type: 'select',
          defaultValue: 'kg',
          options: [
            { label: 'kg', value: 'kg' },
            { label: 'lbs', value: 'lbs' }
          ]
        }
      ]
    },
    {
      name: 'goal',
      type: 'select',
      required: true,
      defaultValue: 'maintain',
      options: [
        { label: 'Cut (Lose Fat)', value: 'cut' },
        { label: 'Maintain', value: 'maintain' },
        { label: 'Gain (Build Muscle)', value: 'gain' }
      ]
    },
    {
      name: 'liftingDaysPerWeek',
      type: 'number',
      min: 0,
      max: 7,
      defaultValue: 4
    },
    {
      name: 'dailyStepsEstimate',
      type: 'number',
      min: 0,
      max: 50000,
      defaultValue: 8000
    },
    {
      name: 'aggression',
      type: 'select',
      defaultValue: 'safe',
      options: [
        { label: 'Safe', value: 'safe' },
        { label: 'Aggressive', value: 'aggressive' }
      ]
    },
    {
      name: 'deadlineDate',
      type: 'date',
      admin: {
        description: 'Optional target date for your goal'
      }
    },
    {
      name: 'dietaryRestrictions',
      type: 'group',
      fields: [
        {
          name: 'allergies',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Nuts', value: 'nuts' },
            { label: 'Dairy', value: 'dairy' },
            { label: 'Gluten', value: 'gluten' },
            { label: 'Eggs', value: 'eggs' },
            { label: 'Fish', value: 'fish' },
            { label: 'Shellfish', value: 'shellfish' },
            { label: 'Soy', value: 'soy' }
          ]
        },
        {
          name: 'dietaryPattern',
          type: 'select',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Halal', value: 'halal' },
            { label: 'Kosher', value: 'kosher' },
            { label: 'Vegetarian', value: 'vegetarian' },
            { label: 'Pescatarian', value: 'pescatarian' },
            { label: 'Vegan', value: 'vegan' }
          ]
        },
        {
          name: 'excludedFoods',
          type: 'array',
          fields: [
            { name: 'food', type: 'text' }
          ]
        }
      ]
    },
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'cookEverything',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'I cook all my meals'
          }
        },
        {
          name: 'repeatMeals',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'I prefer eating the same meals daily'
          }
        },
        {
          name: 'mealsPerDay',
          type: 'number',
          min: 2,
          max: 6,
          defaultValue: 3
        },
        {
          name: 'cardioPreference',
          type: 'select',
          defaultValue: 'incline_walk',
          options: [
            { label: 'Incline Walk', value: 'incline_walk' },
            { label: 'Bike', value: 'bike' },
            { label: 'None', value: 'none' }
          ]
        }
      ]
    },
    {
      name: 'macroTargets',
      type: 'group',
      admin: {
        description: 'Auto-calculated based on goals'
      },
      fields: [
        { name: 'calories', type: 'number' },
        { name: 'protein', type: 'number' },
        { name: 'carbs', type: 'number' },
        { name: 'fat', type: 'number' },
        { name: 'fiber', type: 'number' },
        { name: 'water', type: 'number', admin: { description: 'Liters per day' } }
      ]
    },
    {
      name: 'boringMode',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable BORING mode (no fasting, no cheat meals, consistent meals)'
      }
    }
  ]
}
