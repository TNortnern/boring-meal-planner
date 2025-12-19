import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/Users'
import { Recipes } from './collections/Recipes'
import { Ingredients } from './collections/Ingredients'
import { Exercises } from './collections/Exercises'
import { MealPlans } from './collections/MealPlans'
import { WorkoutPlans } from './collections/WorkoutPlans'
import { ProgressLogs } from './collections/ProgressLogs'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname)
    },
    meta: {
      titleSuffix: ' | BORING Meal Planner'
    }
  },

  collections: [
    Users,
    Recipes,
    Ingredients,
    Exercises,
    MealPlans,
    WorkoutPlans,
    ProgressLogs,
    Media
  ],

  globals: [],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || 'CHANGE-ME-IN-PRODUCTION',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts')
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgresql://postgres:postgres@localhost:5433/boring_meal_planner'
    }
  }),

  plugins: [],

  telemetry: false
})
