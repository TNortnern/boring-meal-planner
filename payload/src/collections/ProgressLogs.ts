import type { CollectionConfig } from 'payload'

export const ProgressLogs: CollectionConfig = {
  slug: 'progress-logs',
  admin: {
    useAsTitle: 'date',
    defaultColumns: ['date', 'user', 'weight', 'waist']
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true
    },
    {
      name: 'date',
      type: 'date',
      required: true
    },
    {
      name: 'weight',
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
      name: 'waist',
      type: 'group',
      admin: {
        description: 'Weekly measurement only'
      },
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
      name: 'steps',
      type: 'number',
      admin: {
        description: 'Daily step count'
      }
    },
    {
      name: 'mealsEaten',
      type: 'array',
      fields: [
        {
          name: 'slot',
          type: 'select',
          options: [
            { label: 'Meal 1', value: 'meal_1' },
            { label: 'Meal 2', value: 'meal_2' },
            { label: 'Meal 3', value: 'meal_3' },
            { label: 'Meal 4', value: 'meal_4' },
            { label: 'Meal 5', value: 'meal_5' }
          ]
        },
        {
          name: 'eaten',
          type: 'checkbox',
          defaultValue: false
        },
        {
          name: 'recipe',
          type: 'relationship',
          relationTo: 'recipes'
        }
      ]
    },
    {
      name: 'macrosConsumed',
      type: 'group',
      admin: {
        description: 'Auto-calculated from meals eaten'
      },
      fields: [
        { name: 'calories', type: 'number' },
        { name: 'protein', type: 'number' },
        { name: 'carbs', type: 'number' },
        { name: 'fat', type: 'number' }
      ]
    },
    {
      name: 'workoutCompleted',
      type: 'checkbox',
      defaultValue: false
    },
    // TODO: Re-add workoutData with proper migration - column doesn't exist in production
    // {
    //   name: 'workoutData',
    //   type: 'json',
    //   admin: {
    //     description: 'Structured workout session data including exercises, sets, reps, and weights'
    //   }
    // },
    {
      name: 'cardioCompleted',
      type: 'checkbox',
      defaultValue: false
    },
    {
      name: 'cardioMinutes',
      type: 'number'
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Optional notes (disabled in boring mode)'
      }
    },
    {
      name: 'isCheckInDay',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark if this is a weekly check-in day'
      }
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional progress photo'
      }
    },
    // TODO: Re-add progressPhotos with proper migration after fixing production DB
    // The progress_logs_progress_photos join table doesn't exist in production
    // {
    //   name: 'progressPhotos',
    //   type: 'array',
    //   admin: {
    //     description: 'Progress photos stored externally (Bunny CDN)'
    //   },
    //   fields: [
    //     {
    //       name: 'url',
    //       type: 'text',
    //       required: true
    //     },
    //     {
    //       name: 'type',
    //       type: 'select',
    //       defaultValue: 'front',
    //       options: [
    //         { label: 'Front', value: 'front' },
    //         { label: 'Side', value: 'side' },
    //         { label: 'Back', value: 'back' }
    //       ]
    //     },
    //     {
    //       name: 'uploadedAt',
    //       type: 'date'
    //     }
    //   ]
    // },
    {
      name: 'shoppingListPurchased',
      type: 'json',
      admin: {
        description: 'Array of purchased ingredient names for this day'
      }
    },
    {
      name: 'measurements',
      type: 'group',
      admin: {
        description: 'Body measurements for check-in days'
      },
      fields: [
        { name: 'chest', type: 'number' },
        { name: 'arms', type: 'number' },
        { name: 'thighs', type: 'number' },
        { name: 'bodyFat', type: 'number' }
      ]
    }
  ]
}
