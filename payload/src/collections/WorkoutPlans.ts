import type { CollectionConfig } from 'payload'

export const WorkoutPlans: CollectionConfig = {
  slug: 'workout-plans',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'user', 'splitType', 'daysPerWeek']
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true
    },
    {
      name: 'splitType',
      type: 'select',
      required: true,
      options: [
        { label: 'Full Body', value: 'full_body' },
        { label: 'Upper/Lower', value: 'upper_lower' },
        { label: 'Push/Pull/Legs', value: 'ppl' },
        { label: 'Push/Pull/Legs + Upper', value: 'ppl_upper' },
        { label: 'Bro Split', value: 'bro_split' },
        { label: 'Custom', value: 'custom' }
      ]
    },
    {
      name: 'daysPerWeek',
      type: 'number',
      required: true,
      min: 2,
      max: 7,
      defaultValue: 4
    },
    {
      name: 'goal',
      type: 'select',
      required: true,
      options: [
        { label: 'Maintain Strength (Cut)', value: 'maintain' },
        { label: 'Build Strength', value: 'strength' },
        { label: 'Hypertrophy', value: 'hypertrophy' }
      ]
    },
    {
      name: 'workouts',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'dayName',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "Push Day", "Upper A", "Leg Day"'
          }
        },
        {
          name: 'dayOfWeek',
          type: 'select',
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
          name: 'exercises',
          type: 'array',
          required: false, // Exercises managed locally until DB is seeded
          fields: [
            {
              name: 'exercise',
              type: 'relationship',
              relationTo: 'exercises',
              required: true
            },
            {
              name: 'sets',
              type: 'number',
              required: true,
              defaultValue: 3
            },
            {
              name: 'reps',
              type: 'text',
              required: true,
              defaultValue: '8-12',
              admin: {
                description: 'Rep range or specific number'
              }
            },
            {
              name: 'restSeconds',
              type: 'number',
              defaultValue: 90
            },
            {
              name: 'notes',
              type: 'text',
              admin: {
                description: 'e.g., "Maintain strength during cut"'
              }
            },
            {
              name: 'isLocked',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'User has locked this as a favorite exercise'
              }
            }
          ]
        }
      ]
    },
    {
      name: 'cardio',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Incline Walk', value: 'incline_walk' },
            { label: 'Bike', value: 'bike' },
            { label: 'Stair Climber', value: 'stairs' },
            { label: 'Rowing', value: 'rowing' },
            { label: 'None', value: 'none' }
          ]
        },
        {
          name: 'durationMinutes',
          type: 'number',
          defaultValue: 20
        },
        {
          name: 'frequency',
          type: 'text',
          admin: {
            description: 'e.g., "After each workout" or "3x per week"'
          }
        }
      ]
    },
    {
      name: 'dailyStepsTarget',
      type: 'number',
      defaultValue: 10000
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true
    }
  ]
}
