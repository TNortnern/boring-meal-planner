import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'profile.name', 'createdAt']
  },
  access: {
    // Allow anyone to register (create a new account)
    create: () => true,
    // Only authenticated users can read their own data
    read: ({ req: { user } }) => {
      if (user) {
        return {
          id: {
            equals: user.id
          }
        }
      }
      return false
    },
    // Only authenticated users can update their own data
    update: ({ req: { user } }) => {
      if (user) {
        return {
          id: {
            equals: user.id
          }
        }
      }
      return false
    },
    // Nobody can delete users (admin can via admin panel)
    delete: () => false
  },
  auth: {
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      domain: undefined
    },
    tokenExpiration: 7 * 24 * 60 * 60, // 7 days
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000 // 10 minutes
  },
  fields: [
    {
      name: 'profile',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Full name'
          }
        },
        {
          name: 'age',
          type: 'number',
          min: 13,
          max: 120,
          admin: {
            description: 'Age in years'
          }
        },
        {
          name: 'sex',
          type: 'select',
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' }
          ],
          admin: {
            description: 'Biological sex (for calorie calculations)'
          }
        },
        {
          name: 'height',
          type: 'number',
          min: 100,
          max: 250,
          admin: {
            description: 'Height in cm'
          }
        },
        {
          name: 'weight',
          type: 'number',
          min: 30,
          max: 300,
          admin: {
            description: 'Current weight in kg'
          }
        },
        {
          name: 'goal',
          type: 'select',
          options: [
            { label: 'Lose Weight', value: 'lose' },
            { label: 'Maintain Weight', value: 'maintain' },
            { label: 'Gain Muscle', value: 'gain' }
          ],
          admin: {
            description: 'Fitness goal'
          }
        },
        {
          name: 'activityLevel',
          type: 'select',
          options: [
            { label: 'Sedentary (little to no exercise)', value: 'sedentary' },
            { label: 'Lightly Active (1-3 days/week)', value: 'light' },
            { label: 'Moderately Active (3-5 days/week)', value: 'moderate' },
            { label: 'Very Active (6-7 days/week)', value: 'very' },
            { label: 'Extremely Active (athlete)', value: 'extreme' }
          ],
          admin: {
            description: 'Activity level'
          }
        }
      ]
    },
    {
      name: 'macros',
      type: 'group',
      label: 'Macro Targets',
      fields: [
        {
          name: 'calories',
          type: 'number',
          admin: {
            description: 'Daily calorie target (auto-calculated if not set)'
          }
        },
        {
          name: 'protein',
          type: 'number',
          admin: {
            description: 'Daily protein target in grams'
          }
        },
        {
          name: 'carbs',
          type: 'number',
          admin: {
            description: 'Daily carbs target in grams'
          }
        },
        {
          name: 'fat',
          type: 'number',
          admin: {
            description: 'Daily fat target in grams'
          }
        }
      ]
    },
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'boringMode',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable BORING mode (same meals every day)'
          }
        },
        {
          name: 'mealsPerDay',
          type: 'number',
          defaultValue: 3,
          min: 1,
          max: 6,
          admin: {
            description: 'Number of meals per day'
          }
        },
        {
          name: 'allergies',
          type: 'array',
          fields: [
            {
              name: 'allergen',
              type: 'text'
            }
          ],
          admin: {
            description: 'Food allergies or intolerances'
          }
        },
        {
          name: 'dietaryPattern',
          type: 'select',
          options: [
            { label: 'Omnivore', value: 'omnivore' },
            { label: 'Vegetarian', value: 'vegetarian' },
            { label: 'Vegan', value: 'vegan' },
            { label: 'Pescatarian', value: 'pescatarian' },
            { label: 'Keto', value: 'keto' },
            { label: 'Paleo', value: 'paleo' }
          ],
          defaultValue: 'omnivore',
          admin: {
            description: 'Dietary pattern preference'
          }
        }
      ]
    }
  ],
  timestamps: true
}
