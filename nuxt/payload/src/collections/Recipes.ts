import type { CollectionConfig } from 'payload'

export const Recipes: CollectionConfig = {
  slug: 'recipes',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'calories', 'protein', 'createdAt']
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Recipe name'
      }
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the recipe'
      }
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Breakfast', value: 'breakfast' },
        { label: 'Lunch', value: 'lunch' },
        { label: 'Dinner', value: 'dinner' },
        { label: 'Snack', value: 'snack' }
      ],
      admin: {
        description: 'Meal category'
      }
    },
    {
      name: 'ingredients',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true
        },
        {
          name: 'amount',
          type: 'text',
          required: true
        }
      ],
      admin: {
        description: 'List of ingredients with amounts'
      }
    },
    {
      name: 'instructions',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'step',
          type: 'textarea',
          required: true
        }
      ],
      admin: {
        description: 'Step-by-step cooking instructions'
      }
    },
    {
      name: 'nutrition',
      type: 'group',
      label: 'Nutritional Information',
      fields: [
        {
          name: 'calories',
          type: 'number',
          required: true,
          admin: {
            description: 'Total calories per serving'
          }
        },
        {
          name: 'protein',
          type: 'number',
          required: true,
          admin: {
            description: 'Protein in grams'
          }
        },
        {
          name: 'carbs',
          type: 'number',
          required: true,
          admin: {
            description: 'Carbohydrates in grams'
          }
        },
        {
          name: 'fat',
          type: 'number',
          required: true,
          admin: {
            description: 'Fat in grams'
          }
        },
        {
          name: 'fiber',
          type: 'number',
          admin: {
            description: 'Fiber in grams'
          }
        }
      ]
    },
    {
      name: 'prepTime',
      type: 'number',
      admin: {
        description: 'Preparation time in minutes'
      }
    },
    {
      name: 'cookTime',
      type: 'number',
      admin: {
        description: 'Cooking time in minutes'
      }
    },
    {
      name: 'servings',
      type: 'number',
      defaultValue: 1,
      min: 1,
      admin: {
        description: 'Number of servings'
      }
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text'
        }
      ],
      admin: {
        description: 'Tags for filtering (e.g., "quick", "budget-friendly", "high-protein")'
      }
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Recipe image'
      }
    }
  ],
  timestamps: true
}
