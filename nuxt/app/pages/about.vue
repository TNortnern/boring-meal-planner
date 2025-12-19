<script setup lang="ts">
definePageMeta({
  layout: 'public'
})

// Team members
const team = [
  {
    name: 'Alex Chen',
    role: 'Founder & Product',
    bio: 'Former competitive powerlifter who got tired of overcomplicated meal tracking apps.',
    initials: 'AC'
  },
  {
    name: 'Sarah Mitchell',
    role: 'Nutrition Science',
    bio: 'Registered dietitian specializing in evidence-based, sustainable eating patterns.',
    initials: 'SM'
  },
  {
    name: 'Marcus Johnson',
    role: 'Engineering',
    bio: 'Full-stack developer who believes the best software is invisible.',
    initials: 'MJ'
  }
]

// Core values
const values = [
  {
    icon: 'i-lucide-target',
    title: 'Simplicity First',
    description: 'We remove features, not add them. Every decision is filtered through: does this reduce complexity?'
  },
  {
    icon: 'i-lucide-chart-line',
    title: 'Results Over Variety',
    description: 'Variety is overrated. Consistency compounds. We optimize for adherence, not entertainment.'
  },
  {
    icon: 'i-lucide-shield-check',
    title: 'Evidence-Based',
    description: 'No trends, no hacks, no shortcuts. Just proven nutrition principles applied ruthlessly.'
  },
  {
    icon: 'i-lucide-users',
    title: 'User-Funded',
    description: 'No ads, no investors, no ulterior motives. Built for users, funded by users.'
  }
]

// Story milestones
const milestones = [
  {
    year: '2024',
    title: 'The Problem',
    description: 'After trying every meal planning app on the market, we realized they all optimize for variety and engagement, not results.'
  },
  {
    year: '2024',
    title: 'The Hypothesis',
    description: 'What if we built the opposite? An app that actively limits choice and encourages boring consistency?'
  },
  {
    year: '2025',
    title: 'The Launch',
    description: 'BORING Meal Planner goes live. Users report higher adherence rates than any other tracking method they\'ve tried.'
  },
  {
    year: 'Now',
    title: 'The Mission',
    description: 'Help people achieve their goals by removing the mental burden of meal planning and decision fatigue.'
  }
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-slate-500/5" />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium mb-6">
            <UIcon name="i-lucide-info" class="w-4 h-4" />
            <span>About Us</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            We Believe in Boring
          </h1>

          <p class="text-lg sm:text-xl text-muted mb-8">
            BORING Meal Planner was built on a simple premise: the best meal plan is the one you actually follow. And the easiest plan to follow is the one that requires zero decisions.
          </p>

          <p class="text-lg text-muted">
            We're a small team of nutrition nerds, lifters, and engineers who got frustrated with overcomplicated diet apps. So we built the opposite.
          </p>
        </div>
      </div>
    </section>

    <!-- Story Section -->
    <section class="py-24 bg-elevated/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            Our Story
          </h2>
          <p class="text-lg text-muted max-w-2xl mx-auto">
            From frustration to solution in four steps.
          </p>
        </div>

        <div class="max-w-4xl mx-auto">
          <div class="space-y-8">
            <div
              v-for="(milestone, index) in milestones"
              :key="index"
              class="flex gap-6"
            >
              <div class="flex flex-col items-center">
                <div class="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary flex items-center justify-center flex-shrink-0">
                  <span class="text-sm font-bold text-primary">{{ milestone.year }}</span>
                </div>
                <div
                  v-if="index < milestones.length - 1"
                  class="w-0.5 h-full bg-gradient-to-b from-primary/30 to-transparent mt-2"
                />
              </div>
              <div class="pb-8">
                <h3 class="text-xl font-semibold mb-2">
                  {{ milestone.title }}
                </h3>
                <p class="text-muted">
                  {{ milestone.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            What We Stand For
          </h2>
          <p class="text-lg text-muted max-w-2xl mx-auto">
            Four principles that guide every decision we make.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div
            v-for="value in values"
            :key="value.title"
            class="p-6 rounded-2xl bg-elevated border border-default"
          >
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <UIcon :name="value.icon" class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-lg font-semibold mb-2">
              {{ value.title }}
            </h3>
            <p class="text-muted">
              {{ value.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-24 bg-elevated/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            The Team
          </h2>
          <p class="text-lg text-muted max-w-2xl mx-auto">
            Small team, big commitment to simplicity.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div
            v-for="member in team"
            :key="member.name"
            class="p-6 rounded-2xl bg-default border border-default text-center"
          >
            <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-primary">{{ member.initials }}</span>
            </div>
            <h3 class="text-lg font-semibold mb-1">
              {{ member.name }}
            </h3>
            <p class="text-sm text-primary font-medium mb-3">
              {{ member.role }}
            </p>
            <p class="text-sm text-muted">
              {{ member.bio }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Philosophy Section -->
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto">
          <div class="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-transparent to-slate-500/10 border border-primary/20">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-lightbulb" class="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 class="text-2xl font-bold mb-4">
                  The BORING Philosophy
                </h3>
                <div class="space-y-4 text-muted">
                  <p>
                    Most meal planning apps try to make nutrition "fun" and "exciting." They add gamification, social features, recipe discovery, and endless customization options.
                  </p>
                  <p>
                    We think that's backwards. Nutrition isn't supposed to be entertainment. It's fuel. Infrastructure. The foundation that supports your goals.
                  </p>
                  <p class="font-medium text-default">
                    The best nutrition plan is the one that fades into the background and just works.
                  </p>
                  <p>
                    That's why we built BORING. No distractions. No decisions. Just locked macros, simple meals, and consistent results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-elevated/30">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4">
          Join the Boring Revolution
        </h2>
        <p class="text-lg text-muted mb-8 max-w-2xl mx-auto">
          Stop overthinking your meals. Start making progress.
        </p>
        <UButton to="/register" size="xl" color="primary">
          Get Started Free
        </UButton>
      </div>
    </section>
  </div>
</template>
