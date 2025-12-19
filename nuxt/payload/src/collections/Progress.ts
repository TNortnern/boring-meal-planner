import type { CollectionConfig } from 'payload'

export const Progress: CollectionConfig = {
  slug: 'progress',
  admin: {
    useAsTitle: 'userId',
    defaultColumns: ['userId', 'updatedAt']
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
      unique: true,
      admin: {
        description: 'User this progress tracking belongs to'
      }
    },
    {
      name: 'weightEntries',
      type: 'array',
      label: 'Weight History',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          admin: {
            description: 'Date of weight measurement'
          }
        },
        {
          name: 'weight',
          type: 'number',
          required: true,
          admin: {
            description: 'Weight in kg'
          }
        }
      ]
    },
    {
      name: 'measurements',
      type: 'array',
      label: 'Body Measurements',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          admin: {
            description: 'Date of measurement'
          }
        },
        {
          name: 'waist',
          type: 'number',
          admin: {
            description: 'Waist circumference in cm'
          }
        },
        {
          name: 'chest',
          type: 'number',
          admin: {
            description: 'Chest circumference in cm'
          }
        },
        {
          name: 'arms',
          type: 'number',
          admin: {
            description: 'Arm circumference in cm'
          }
        },
        {
          name: 'thighs',
          type: 'number',
          admin: {
            description: 'Thigh circumference in cm'
          }
        },
        {
          name: 'bodyFat',
          type: 'number',
          admin: {
            description: 'Body fat percentage'
          }
        }
      ]
    },
    {
      name: 'photos',
      type: 'array',
      label: 'Progress Photos',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          admin: {
            description: 'Date photo was taken'
          }
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Progress photo'
          }
        },
        {
          name: 'view',
          type: 'select',
          options: [
            { label: 'Front', value: 'front' },
            { label: 'Side', value: 'side' },
            { label: 'Back', value: 'back' }
          ],
          admin: {
            description: 'Photo angle'
          }
        },
        {
          name: 'notes',
          type: 'textarea',
          admin: {
            description: 'Notes about this photo'
          }
        }
      ]
    }
  ],
  timestamps: true
}
