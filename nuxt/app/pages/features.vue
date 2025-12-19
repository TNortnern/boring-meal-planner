<script setup lang="ts">
definePageMeta({
  layout: 'public'
})

// Main features with detailed descriptions
const mainFeatures = [
  {
    icon: 'i-lucide-calculator',
    title: 'Locked Macro Calculation',
    description: 'Enter your stats once. We calculate your exact calorie and macro targets based on your goal (cut/maintain/gain), activity level, and aggression.',
    details: [
      'Science-based formulas from proven research',
      'Locked targets - no daily adjustments',
      'Protein prioritized for muscle retention',
      'Simple carb and fat allocation'
    ]
  },
  {
    icon: 'i-lucide-repeat',
    title: 'BORING Mode Meal Plans',
    description: 'Same meals daily or simple A/B rotation. Maximum two meal variations to eliminate decision fatigue and ensure perfect macro consistency.',
    details: [
      'Max 10 ingredients per recipe',
      'Prep time under 25 minutes',
      'Calculated macros per serving',
      'No variety paralysis'
    ]
  },
  {
    icon: 'i-lucide-trending-up',
    title: 'Progress Tracking',
    description: 'Weekly weight and waist measurements. Simple, proven metrics that actually indicate fat loss or muscle gain.',
    details: [
      'Track weight and waist only',
      'Weekly check-ins',
      '14-day plateau detection',
      'Visual progress charts'
    ]
  },
  {
    icon: 'i-lucide-activity',
    title: 'Workout Logging',
    description: 'Log your training sessions with exercise, weight, reps, and rest time. No overcomplicated programs or confusing metrics.',
    details: [
      'Exercise library with muscle maps',
      'Track progressive overload',
      'Rest timer built in',
      'Training history by exercise'
    ]
  },
  {
    icon: 'i-lucide-book-open',
    title: 'Recipe Library',
    description: 'Curated collection of boring, effective recipes. Every recipe is macro-calculated and ingredient-minimal.',
    details: [
      'Filter by macro targets',
      'Boring score (higher = simpler)',
      'Swap compatible recipes',
      'Save favorite combinations'
    ]
  },
  {
    icon: 'i-lucide-alert-triangle',
    title: 'Plateau Protocol',
    description: 'When weight AND waist stall for 14 days, get exact instructions: add cardio OR reduce calories. Never both. Never guessing.',
    details: [
      'Automatic stall detection',
      'Conservative adjustments',
      '+10 min cardio option',
      '-100 to -150 calorie option'
    ]
  }
]

// What BORING Mode excludes
const excludes = [
  {
    icon: 'i-lucide-ban',
    title: 'No Fasting Protocols',
    description: 'Intermittent fasting is a preference, not a requirement. We focus on what actually matters: total intake.'
  },
  {
    icon: 'i-lucide-ban',
    title: 'No Cheat Meals',
    description: 'Consistency beats cycling. Your macros are set for sustainable adherence, not deprivation.'
  },
  {
    icon: 'i-lucide-ban',
    title: 'No "Eat Back" Calories',
    description: 'Cardio is for health and deficit. We don\'t add back exercise calories because they\'re already factored in.'
  },
  {
    icon: 'i-lucide-ban',
    title: 'No Daily Macro Adjustments',
    description: 'Locked targets. No carb cycling, no refeed days, no complicated scheduling.'
  }
]

// Comparison with other approaches
const comparison = [
  {
    category: 'Meal Variety',
    boring: 'Same meals or A/B rotation',
    others: 'Hundreds of recipes, constant variety'
  },
  {
    category: 'Decision Making',
    boring: 'Zero daily decisions',
    others: 'Choose meals, track portions daily'
  },
  {
    category: 'Macro Targets',
    boring: 'Locked, never change unless plateau',
    others: 'Adjust based on daily activity'
  },
  {
    category: 'Progress Metrics',
    boring: 'Weight + waist, weekly',
    others: 'Multiple metrics, daily weigh-ins'
  },
  {
    category: 'Learning Curve',
    boring: 'Set once, repeat forever',
    others: 'Ongoing learning and adjustment'
  }
]

// Integration features
const integrations = [
  {
    icon: 'i-lucide-smartphone',
    title: 'Mobile Responsive',
    description: 'Full functionality on any device. Install as PWA for native app experience.'
  },
  {
    icon: 'i-lucide-download',
    title: 'Export Data',
    description: 'Download your progress logs, meal plans, and workout history anytime.'
  },
  {
    icon: 'i-lucide-shield',
    title: 'Privacy First',
    description: 'Your data is yours. No selling, no sharing, no tracking beyond what you explicitly log.'
  },
  {
    icon: 'i-lucide-zap',
    title: 'Fast & Simple',
    description: 'No bloat, no unnecessary features. Built to be fast and get out of your way.'
  }
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-slate-500/5" />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium mb-6">
            <UIcon name="i-lucide-sparkles" class="w-4 h-4" />
            <span>Features</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Everything You Need. Nothing You Don't.
          </h1>

          <p class="text-lg sm:text-xl text-muted">
            BORING Meal Planner is ruthlessly focused on what actually drives results: consistency, simplicity, and adherence.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Features Section -->
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            Core Features
          </h2>
          <p class="text-lg text-muted max-w-2xl mx-auto">
            Six features that make boring work.
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-8">
          <div
            v-for="feature in mainFeatures"
            :key="feature.title"
            class="p-8 rounded-2xl bg-elevated border border-default hover:border-primary/30 transition-all duration-300"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <UIcon :name="feature.icon" class="w-6 h-6 text-primary" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-semibold mb-2">
                  {{ feature.title }}
                </h3>
                <p class="text-muted mb-4">
                  {{ feature.description }}
                </p>
                <ul class="space-y-2">
                  <li
                    v-for="detail in feature.details"
                    :key="detail"
                    class="flex items-start gap-2 text-sm text-muted"
                  >
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{{ detail }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- What We Exclude Section -->
    <section class="py-24 bg-elevated/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            What BORING Mode Excludes
          </h2>
          <p class="text-lg text-muted max-w-2xl mx-auto">
            We intentionally leave out features that add complexity without improving results.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div
            v-for="exclude in excludes"
            :key="exclude.title"
            class="p-6 rounded-2xl bg-default border border-default"
          >
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <UIcon :name="exclude.icon" class="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1">
                  {{ exclude.title }}
                </h3>
                <p class="text-sm text-muted">
                  {{ exclude.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison Section -->
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            BORING vs. Traditional Apps
          </h2>
          <p class="text-lg text-muted max-w-2xl mx-auto">
            See how our approach differs from typical meal planning apps.
          </p>
        </div>

        <div class="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-default">
          <div class="bg-elevated">
            <div class="grid grid-cols-3 gap-4 p-4 border-b border-default font-semibold text-sm">
              <div>Feature</div>
              <div class="text-primary">
                BORING Mode
              </div>
              <div class="text-muted">
                Traditional Apps
              </div>
            </div>
            <div class="divide-y divide-default">
              <div
                v-for="row in comparison"
                :key="row.category"
                class="grid grid-cols-3 gap-4 p-4 text-sm"
              >
                <div class="font-medium">
                  {{ row.category }}
                </div>
                <div class="text-muted">
                  {{ row.boring }}
                </div>
                <div class="text-muted">
                  {{ row.others }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Additional Features Section -->
    <section class="py-24 bg-elevated/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            Platform Features
          </h2>
          <p class="text-lg text-muted max-w-2xl mx-auto">
            Modern functionality without the bloat.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="integration in integrations"
            :key="integration.title"
            class="p-6 rounded-2xl bg-default border border-default text-center"
          >
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <UIcon :name="integration.icon" class="w-6 h-6 text-primary" />
            </div>
            <h3 class="font-semibold mb-2">
              {{ integration.title }}
            </h3>
            <p class="text-sm text-muted">
              {{ integration.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4">
          Ready to Simplify?
        </h2>
        <p class="text-lg text-muted mb-8 max-w-2xl mx-auto">
          Stop managing complexity. Start making progress.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <UButton to="/register" size="xl" color="primary">
            Get Started Free
          </UButton>
          <UButton
            to="/about"
            variant="outline"
            size="xl"
            color="neutral"
          >
            Learn More
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>
