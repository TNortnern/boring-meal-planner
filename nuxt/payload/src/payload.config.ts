import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { bunnyStoragePlugin, createBunnyStorageFromEnv } from './lib/bunnyStorage'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { MealPlans } from './collections/MealPlans'
import { Workouts } from './collections/Workouts'
import { Progress } from './collections/Progress'
import { Recipes } from './collections/Recipes'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Get database connection string with fallback to individual PG* variables.
 */
function getDatabaseUri(): string {
  const uri = process.env.DATABASE_URI || ''

  // Check if DATABASE_URI is valid
  if (uri && uri.length > 15 && uri.includes('@')) {
    console.log('[DB] Using DATABASE_URI from environment')
    return uri
  }

  // Fallback: construct from individual PG* variables
  const { PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE } = process.env

  if (PGHOST && PGUSER && PGPASSWORD && PGDATABASE) {
    const port = PGPORT || '5432'
    const constructedUri = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${port}/${PGDATABASE}`
    console.log(`[DB] Constructed connection string from PG* vars: ${PGHOST}:${port}/${PGDATABASE}`)
    return constructedUri
  }

  // Last resort: try DATABASE_URL
  if (process.env.DATABASE_URL) {
    console.log('[DB] Using DATABASE_URL from environment')
    return process.env.DATABASE_URL
  }

  console.error('[DB] WARNING: No valid database connection string found!')
  console.error('[DB] Set DATABASE_URI, DATABASE_URL, or individual PG* variables')
  return ''
}

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3004',

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname)
    },
    meta: {
      titleSuffix: '- BORING Meal Planner',
      favicon: '/favicon.ico',
      ogImage: '/og-image.png'
    }
  },

  cors: [
    'http://localhost:3009', // Nuxt dev server (BORING)
    'http://localhost:3002', // Payload dev server (BORING)
    'http://localhost:3005', // Nuxt dev server
    'http://localhost:3004', // Payload dev server
    'http://localhost:3001', // Nuxt internal port
    'http://localhost:3000', // Payload internal port
    ...(process.env.PAYLOAD_PUBLIC_SERVER_URL ? [process.env.PAYLOAD_PUBLIC_SERVER_URL] : []),
    ...(process.env.RAILWAY_PUBLIC_DOMAIN ? [`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`] : [])
  ],

  csrf: [
    'http://localhost:3009',
    'http://localhost:3002',
    'http://localhost:3005',
    'http://localhost:3004',
    'http://localhost:3001',
    'http://localhost:3000',
    ...(process.env.PAYLOAD_PUBLIC_SERVER_URL ? [process.env.PAYLOAD_PUBLIC_SERVER_URL] : []),
    ...(process.env.RAILWAY_PUBLIC_DOMAIN ? [`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`] : [])
  ],

  collections: [Users, Media, MealPlans, Workouts, Progress, Recipes],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts')
  },

  db: postgresAdapter({
    pool: {
      connectionString: getDatabaseUri(),
      ...(process.env.DATABASE_SSL === 'auto'
        ? {}
        : {
            ssl:
              process.env.DATABASE_SSL === 'simple' || process.env.DATABASE_SSL === 'require'
                ? true
                : process.env.DATABASE_SSL === 'true'
                  ? { rejectUnauthorized: false }
                  : false
          })
    },
    push: true
  }),

  sharp,

  plugins: [
    // Bunny CDN Storage (enabled via environment variable)
    bunnyStoragePlugin(createBunnyStorageFromEnv())
  ],

  onInit: async (payload) => {
    payload.logger.info('BORING Meal Planner CMS initialized')
  }
})
