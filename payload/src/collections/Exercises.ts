import type { CollectionConfig } from 'payload'

export const Exercises: CollectionConfig = {
  slug: 'exercises',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'primaryMuscle', 'equipment', 'difficulty']
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'primaryMuscle',
      type: 'select',
      required: true,
      options: [
        { label: 'Chest', value: 'chest' },
        { label: 'Back', value: 'back' },
        { label: 'Shoulders', value: 'shoulders' },
        { label: 'Biceps', value: 'biceps' },
        { label: 'Triceps', value: 'triceps' },
        { label: 'Quads', value: 'quads' },
        { label: 'Hamstrings', value: 'hamstrings' },
        { label: 'Glutes', value: 'glutes' },
        { label: 'Calves', value: 'calves' },
        { label: 'Abs', value: 'abs' },
        { label: 'Forearms', value: 'forearms' },
        { label: 'Traps', value: 'traps' },
        { label: 'Full Body', value: 'full_body' }
      ]
    },
    {
      name: 'secondaryMuscles',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Chest', value: 'chest' },
        { label: 'Back', value: 'back' },
        { label: 'Shoulders', value: 'shoulders' },
        { label: 'Biceps', value: 'biceps' },
        { label: 'Triceps', value: 'triceps' },
        { label: 'Quads', value: 'quads' },
        { label: 'Hamstrings', value: 'hamstrings' },
        { label: 'Glutes', value: 'glutes' },
        { label: 'Calves', value: 'calves' },
        { label: 'Abs', value: 'abs' },
        { label: 'Forearms', value: 'forearms' },
        { label: 'Traps', value: 'traps' }
      ]
    },
    {
      name: 'equipment',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Barbell', value: 'barbell' },
        { label: 'Dumbbell', value: 'dumbbell' },
        { label: 'Cable Machine', value: 'cable' },
        { label: 'Machine', value: 'machine' },
        { label: 'Bodyweight', value: 'bodyweight' },
        { label: 'Kettlebell', value: 'kettlebell' },
        { label: 'Resistance Band', value: 'band' },
        { label: 'Pull-up Bar', value: 'pullup_bar' },
        { label: 'Bench', value: 'bench' },
        { label: 'EZ Bar', value: 'ez_bar' }
      ]
    },
    {
      name: 'difficulty',
      type: 'select',
      required: true,
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' }
      ]
    },
    {
      name: 'bestFor',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Strength', value: 'strength' },
        { label: 'Hypertrophy', value: 'hypertrophy' },
        { label: 'Beginner Safe', value: 'beginner_safe' },
        { label: 'Compound', value: 'compound' },
        { label: 'Isolation', value: 'isolation' }
      ]
    },
    {
      name: 'jointFriendly',
      type: 'group',
      fields: [
        { name: 'kneeFriendly', type: 'checkbox', defaultValue: true },
        { name: 'shoulderFriendly', type: 'checkbox', defaultValue: true },
        { name: 'backFriendly', type: 'checkbox', defaultValue: true },
        { name: 'wristFriendly', type: 'checkbox', defaultValue: true }
      ]
    },
    {
      name: 'minimalSetup',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Quick to set up, minimal equipment changes'
      }
    },
    {
      name: 'formCues',
      type: 'array',
      fields: [
        { name: 'cue', type: 'text', required: true }
      ]
    },
    {
      name: 'commonMistakes',
      type: 'array',
      fields: [
        { name: 'mistake', type: 'text', required: true }
      ]
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      admin: {
        description: 'Curated YouTube tutorial link'
      }
    },
    {
      name: 'muscleMapKey',
      type: 'text',
      admin: {
        description: 'Key for highlighting on muscle map visualization'
      }
    },
    {
      name: 'defaultSets',
      type: 'number',
      defaultValue: 3
    },
    {
      name: 'defaultReps',
      type: 'text',
      defaultValue: '8-12',
      admin: {
        description: 'Default rep range (e.g., "8-12", "5", "12-15")'
      }
    },
    {
      name: 'restSeconds',
      type: 'number',
      defaultValue: 90,
      admin: {
        description: 'Recommended rest time in seconds'
      }
    }
  ]
}
