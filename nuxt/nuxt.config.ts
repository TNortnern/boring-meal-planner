// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/test-utils/module',
    '@vueuse/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Private config (server-side only)
    payloadApiUrl: process.env.NUXT_PAYLOAD_API_URL || 'http://payload:3000',
    payloadApiKey: process.env.PAYLOAD_API_KEY || '',

    // Bunny CDN (server-side only)
    bunnyStorageApiKey: process.env.BUNNY_STORAGE_API_KEY || process.env.BUNNY_API_KEY || '',
    bunnyStorageZone: process.env.BUNNY_STORAGE_ZONE || '',
    bunnyStorageHostname: process.env.BUNNY_STORAGE_HOSTNAME || 'storage.bunnycdn.com',

    // Public config (exposed to client)
    public: {
      payloadUrl: process.env.NUXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3010',
      bunnyCdnHostname: process.env.BUNNY_CDN_HOSTNAME || '',
      appName: 'BORING Meal Planner'
    }
  },

  routeRules: {
    // Proxy Payload API
    '/api/**': {
      proxy: {
        to: `${process.env.NUXT_PAYLOAD_API_URL || 'http://localhost:3002'}/api/**`
      }
    },

    // Proxy Next.js static assets (required for Payload admin)
    '/_next/**': {
      proxy: {
        to: `${process.env.NUXT_PAYLOAD_API_URL || 'http://localhost:3002'}/_next/**`
      }
    },

    // Proxy Payload admin interface
    '/admin/**': {
      proxy: {
        to: `${process.env.NUXT_PAYLOAD_API_URL || 'http://localhost:3002'}/admin/**`
      }
    }
  },

  devServer: {
    port: 3009
  },

  compatibilityDate: '2024-07-11',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // Icon configuration - bundle icons at build time for production
  icon: {
    // Use local icon sets instead of fetching from API
    serverBundle: 'local',
    clientBundle: {
      // Scan components for icon usage and bundle them
      scan: true
    }
  }
})
