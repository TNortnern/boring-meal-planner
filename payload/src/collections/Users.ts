import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email'
  },
  access: {
    // Allow anyone to create a new user (register)
    create: () => true,
    // Allow logged in users to read their own data
    read: () => true,
    // Allow logged in users to update their own data
    update: () => true,
    // Disable delete
    delete: () => false,
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
        { name: 'value', type: 'number' },
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
        { name: 'value', type: 'number' },
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
      name: 'startingWeight',
      type: 'number',
      admin: {
        description: 'Starting weight when you began your journey (in lbs)'
      }
    },
    {
      name: 'goalWeight',
      type: 'number',
      admin: {
        description: 'Target weight goal (in lbs)'
      }
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
          // Changed from hasMany select to text to avoid junction table
          name: 'allergies',
          type: 'text',
          admin: {
            description: 'Comma-separated list of allergies (nuts, dairy, gluten, eggs, fish, shellfish, soy)'
          }
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
          // Changed from array to text to avoid junction table
          name: 'excludedFoods',
          type: 'text',
          admin: {
            description: 'Comma-separated list of excluded foods'
          }
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
