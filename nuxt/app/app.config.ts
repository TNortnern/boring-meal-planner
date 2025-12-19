export default defineAppConfig({
  ui: {
    colors: {
      // Emerald for health/growth - intentionally muted for "boring" aesthetic
      primary: 'emerald',
      // Warm neutral for a less sterile feel
      neutral: 'stone'
    }
  },
  // App-specific config
  app: {
    name: 'BORING Meal Planner',
    description: 'Simple, effective nutrition planning',
    boringMode: {
      maxMealRotation: 2, // Same daily or A/B only
      noFasting: true,
      noCheatMeals: true,
      noEatBackCalories: true
    }
  }
})
