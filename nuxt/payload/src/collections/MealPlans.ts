import type { CollectionConfig } from 'payload'

export const MealPlans: CollectionConfig = {
  slug: 'meal-plans',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'userId', 'startDate', 'createdAt']
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
        description: 'User this meal plan belongs to'
      }
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Meal plan name'
      }
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Start date of the meal plan'
      }
    },
    {
      name: 'days',
      type: 'array',
      minRows: 7,
      maxRows: 7,
      fields: [
        {
          name: 'dayNumber',
          type: 'number',
          required: true,
          min: 1,
          max: 7,
          admin: {
            description: 'Day of the week (1=Monday, 7=Sunday)'
          }
        },
        {
          name: 'meals',
          type: 'array',
          fields: [
            {
              name: 'mealType',
              type: 'select',
              required: true,
              options: [
                { label: 'Breakfast', value: 'breakfast' },
                { label: 'Lunch', value: 'lunch' },
                { label: 'Dinner', value: 'dinner' },
                { label: 'Snack', value: 'snack' }
              ]
            },
            {
              name: 'recipe',
              type: 'relationship',
              relationTo: 'recipes',
              admin: {
                description: 'Recipe for this meal'
              }
            },
            {
              name: 'eaten',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Mark as eaten'
              }
            },
            {
              name: 'eatenAt',
              type: 'date',
              admin: {
                description: 'Time when meal was eaten'
              }
            }
          ]
        }
      ]
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this is the currently active meal plan'
      }
    }
  ],
  timestamps: true
}
