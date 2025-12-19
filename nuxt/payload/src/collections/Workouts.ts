import type { CollectionConfig } from 'payload'

export const Workouts: CollectionConfig = {
  slug: 'workouts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'userId', 'planType', 'createdAt']
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      return {
        userId: {
          equals: user.id
        }
      }
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => {
      if (!user) return false
      return {
        userId: {
          equals: user.id
        }
      }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return {
        userId: {
          equals: user.id
        }
      }
    }
  },
  fields: [
    {
      name: 'userId',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User this workout plan belongs to'
      }
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Workout plan name'
      }
    },
    {
      name: 'planType',
      type: 'select',
      required: true,
      options: [
        { label: 'Push/Pull/Legs', value: 'ppl' },
        { label: 'Upper/Lower', value: 'upper_lower' },
        { label: 'Full Body', value: 'full_body' },
        { label: 'Bro Split', value: 'bro_split' },
        { label: 'Custom', value: 'custom' }
      ],
      admin: {
        description: 'Type of workout split'
      }
    },
    {
      name: 'days',
      type: 'array',
      fields: [
        {
          name: 'dayName',
          type: 'text',
          required: true,
          admin: {
            description: 'Day name (e.g., "Push Day", "Leg Day")'
          }
        },
        {
          name: 'exercises',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: 'Exercise name'
              }
            },
            {
              name: 'sets',
              type: 'number',
              required: true,
              min: 1,
              admin: {
                description: 'Number of sets'
              }
            },
            {
              name: 'reps',
              type: 'text',
              required: true,
              admin: {
                description: 'Reps (e.g., "8-12", "AMRAP")'
              }
            },
            {
              name: 'restSeconds',
              type: 'number',
              admin: {
                description: 'Rest time between sets in seconds'
              }
            },
            {
              name: 'notes',
              type: 'textarea',
              admin: {
                description: 'Exercise notes or form cues'
              }
            }
          ]
        }
      ]
    },
    {
      name: 'sessions',
      type: 'array',
      label: 'Workout History',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          admin: {
            description: 'Date of workout session'
          }
        },
        {
          name: 'dayIndex',
          type: 'number',
          required: true,
          admin: {
            description: 'Index of the workout day that was performed'
          }
        },
        {
          name: 'duration',
          type: 'number',
          admin: {
            description: 'Workout duration in minutes'
          }
        },
        {
          name: 'exerciseLog',
          type: 'array',
          fields: [
            {
              name: 'exerciseName',
              type: 'text',
              required: true
            },
            {
              name: 'setLog',
              type: 'array',
              fields: [
                {
                  name: 'weight',
                  type: 'number',
                  admin: {
                    description: 'Weight used (kg)'
                  }
                },
                {
                  name: 'reps',
                  type: 'number',
                  admin: {
                    description: 'Reps completed'
                  }
                }
              ]
            }
          ]
        },
        {
          name: 'notes',
          type: 'textarea',
          admin: {
            description: 'Session notes'
          }
        }
      ]
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this is the currently active workout plan'
      }
    }
  ],
  timestamps: true
}
