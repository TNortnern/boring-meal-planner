<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: false,
  middleware: []
})

const { isAuthenticated } = useAuth()

// Redirect authenticated users to dashboard
if (import.meta.client && isAuthenticated.value) {
  navigateTo('/dashboard', { replace: true })
}

// Hero section
const heroTitle = 'Stop Overthinking. Start Eating.'
const heroSubtitle = 'BORING Meal Planner gives you locked macros and the same meals daily. No decisions. No variety. Just results.'

// Features
const features = [
  {
    icon: 'i-lucide-lock',
    title: 'Locked Macros',
    description: 'Set your goal once. Get precise targets. No adjustments, no guessing.'
  },
  {
    icon: 'i-lucide-repeat',
    title: 'Same Meals Daily',
    description: 'Eat the same thing every day. Or rotate between A/B. That\'s it.'
  },
  {
    icon: 'i-lucide-dumbbell',
    title: 'Track Workouts',
    description: 'Simple training logs. Weight, reps, rest. No overcomplicated programs.'
  },
  {
    icon: 'i-lucide-trending-up',
    title: 'Progress Monitoring',
    description: 'Weight and waist measurements. If both stall 14 days, adjust cardio or calories.'
  },
  {
    icon: 'i-lucide-list-checks',
    title: 'Max 10 Ingredients',
    description: 'Every recipe uses 10 ingredients or fewer. Simple prep, minimal decisions.'
  },
  {
    icon: 'i-lucide-ban',
    title: 'No Nonsense',
    description: 'No fasting. No cheat meals. No "eat back" calories. Consistency wins.'
  }
]

// How it works
const steps = [
  {
    number: '01',
    title: 'Set Your Goal',
    description: 'Cut, maintain, or gain. We calculate your macros based on weight, activity, and aggression level.'
  },
  {
    number: '02',
    title: 'Get Your Meals',
    description: 'Receive boring but effective meal plans. Same meals daily or simple A/B rotation.'
  },
  {
    number: '03',
    title: 'Track & Adjust',
    description: 'Log weight and waist weekly. If progress stalls, we tell you exactly what to change.'
  }
]

// FAQs
const faqs = [
  {
    question: 'Why the same meals every day?',
    answer: 'Decision fatigue kills consistency. Eating the same meals removes choice paralysis and makes tracking effortless. Boring = sustainable.'
  },
  {
    question: 'Can I customize my meal plan?',
    answer: 'You can swap between approved recipes that hit your macros. But we intentionally limit variety to reduce decisions and maintain consistency.'
  },
  {
    question: 'What if I plateau?',
    answer: 'If weight AND waist measurements stall for 14 days, the app suggests either adding 10 minutes of cardio OR reducing calories by 100-150. Never both at once.'
  },
  {
    question: 'Do I need to count calories?',
    answer: 'Yes. BORING Mode locks your macros and requires consistent tracking. This isn\'t flexible dieting - it\'s structured simplicity.'
  },
  {
    question: 'Is there a mobile app?',
    answer: 'The web app is fully responsive and works perfectly on mobile browsers. Install it as a PWA for an app-like experience.'
  }
]

const openFaqIndex = ref<number | null>(null)

const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-default">
      <!-- Navigation -->
      <nav class="border-b border-default bg-elevated/50 backdrop-blur-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-utensils-crossed" class="w-6 h-6 text-primary" />
              <span class="text-lg font-bold">BORING</span>
            </div>
            <div class="flex items-center gap-3">
              <UButton to="/login" variant="ghost" color="neutral">
                Sign In
              </UButton>
              <UButton to="/register" color="primary">
                Get Started
              </UButton>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-slate-500/5" />
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div class="max-w-3xl mx-auto text-center">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium mb-6">
              <UIcon name="i-lucide-zap" class="w-4 h-4" />
              <span>BORING Mode: Simplicity by design</span>
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {{ heroTitle }}
            </h1>

            <p class="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-8">
              {{ heroSubtitle }}
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <UButton
                to="/register"
                size="xl"
                color="primary"
                class="w-full sm:w-auto"
              >
                Get Started Free
              </UButton>
              <UButton
                to="#how-it-works"
                variant="outline"
                size="xl"
                color="neutral"
                class="w-full sm:w-auto"
              >
                How It Works
              </UButton>
            </div>

            <p class="mt-6 text-sm text-muted">
              No credit card required. Start tracking in 2 minutes.
            </p>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-24 bg-elevated/30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold mb-4">
              Built for Consistency, Not Variety
            </h2>
            <p class="text-lg text-muted max-w-2xl mx-auto">
              Every feature designed to remove decisions and keep you on track.
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="p-6 rounded-2xl bg-default border border-default hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <UIcon :name="feature.icon" class="w-6 h-6 text-primary" />
              </div>
              <h3 class="text-lg font-semibold mb-2">
                {{ feature.title }}
              </h3>
              <p class="text-muted">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section id="how-it-works" class="py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold mb-4">
              Three Steps to Boring Success
            </h2>
            <p class="text-lg text-muted max-w-2xl mx-auto">
              Simple process. Zero complexity.
            </p>
          </div>

          <div class="grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div
              v-for="(step, index) in steps"
              :key="step.number"
              class="relative"
            >
              <div class="text-center">
                <div class="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-4">
                  <span class="text-2xl font-bold text-primary">{{ step.number }}</span>
                </div>
                <h3 class="text-xl font-semibold mb-3">
                  {{ step.title }}
                </h3>
                <p class="text-muted">
                  {{ step.description }}
                </p>
              </div>

              <!-- Connector line (desktop only) -->
              <div
                v-if="index < steps.length - 1"
                class="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent -translate-x-1/2"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Social Proof Section -->
      <section class="py-24 bg-elevated/30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold mb-4">
              Boring Works
            </h2>
            <p class="text-lg text-muted max-w-2xl mx-auto">
              Real results from people who stopped overthinking.
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <div class="p-6 rounded-2xl bg-default border border-default">
              <div class="flex items-center gap-1 mb-4">
                <UIcon
                  v-for="i in 5"
                  :key="i"
                  name="i-lucide-star"
                  class="w-4 h-4 text-amber-500 fill-amber-500"
                />
              </div>
              <p class="text-muted mb-4">
                "I've tried every diet app. This is the only one that removed the mental burden. Same meals, same results, zero thinking."
              </p>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-sm font-bold text-primary">JD</span>
                </div>
                <div>
                  <div class="font-medium text-sm">
                    James D.
                  </div>
                  <div class="text-xs text-muted">
                    Down 18 lbs in 12 weeks
                  </div>
                </div>
              </div>
            </div>

            <div class="p-6 rounded-2xl bg-default border border-default">
              <div class="flex items-center gap-1 mb-4">
                <UIcon
                  v-for="i in 5"
                  :key="i"
                  name="i-lucide-star"
                  class="w-4 h-4 text-amber-500 fill-amber-500"
                />
              </div>
              <p class="text-muted mb-4">
                "Finally, someone gets it. I don't want 50 recipes. I want to eat, train, and see progress. BORING delivers."
              </p>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-sm font-bold text-primary">MC</span>
                </div>
                <div>
                  <div class="font-medium text-sm">
                    Maria C.
                  </div>
                  <div class="text-xs text-muted">
                    Maintained 6 months straight
                  </div>
                </div>
              </div>
            </div>

            <div class="p-6 rounded-2xl bg-default border border-default">
              <div class="flex items-center gap-1 mb-4">
                <UIcon
                  v-for="i in 5"
                  :key="i"
                  name="i-lucide-star"
                  class="w-4 h-4 text-amber-500 fill-amber-500"
                />
              </div>
              <p class="text-muted mb-4">
                "Gained 12 lbs of muscle eating the same 3 meals for months. Boring works when you let it."
              </p>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-sm font-bold text-primary">TP</span>
                </div>
                <div>
                  <div class="font-medium text-sm">
                    Tom P.
                  </div>
                  <div class="text-xs text-muted">
                    Clean bulk, 16 weeks
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="py-24">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold mb-4">
              Questions? We've Got Answers.
            </h2>
          </div>

          <div class="space-y-3">
            <div
              v-for="(faq, index) in faqs"
              :key="index"
              class="rounded-xl bg-elevated border border-default overflow-hidden"
            >
              <button
                type="button"
                class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/10 transition-colors"
                @click="toggleFaq(index)"
              >
                <span class="font-medium">{{ faq.question }}</span>
                <UIcon
                  :name="openFaqIndex === index ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  class="w-5 h-5 text-muted flex-shrink-0"
                />
              </button>
              <div
                v-if="openFaqIndex === index"
                class="px-6 pb-4 text-muted border-t border-default pt-4"
              >
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA Section -->
      <section class="py-24 bg-gradient-to-br from-emerald-500/10 via-transparent to-slate-500/10">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Stop Overthinking?
          </h2>
          <p class="text-lg text-muted mb-8 max-w-2xl mx-auto">
            Join people who choose consistency over variety. Get your locked macros and boring meal plan in minutes.
          </p>
          <UButton to="/register" size="xl" color="primary">
            Start Free Today
          </UButton>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-default bg-elevated/30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div class="flex items-center gap-2 mb-4">
                <UIcon name="i-lucide-utensils-crossed" class="w-5 h-5 text-primary" />
                <span class="font-bold">BORING</span>
              </div>
              <p class="text-sm text-muted">
                Meal planning that prioritizes simplicity and effectiveness over variety.
              </p>
            </div>

            <div>
              <h4 class="font-semibold mb-3 text-sm">
                Product
              </h4>
              <ul class="space-y-2 text-sm text-muted">
                <li><NuxtLink to="/features" class="hover:text-default transition-colors">Features</NuxtLink></li>
                <li><NuxtLink to="/about" class="hover:text-default transition-colors">About</NuxtLink></li>
                <li><NuxtLink to="/register" class="hover:text-default transition-colors">Get Started</NuxtLink></li>
                <li><NuxtLink to="/login" class="hover:text-default transition-colors">Sign In</NuxtLink></li>
              </ul>
            </div>

            <div>
              <h4 class="font-semibold mb-3 text-sm">
                Support
              </h4>
              <ul class="space-y-2 text-sm text-muted">
                <li><NuxtLink to="/contact" class="hover:text-default transition-colors">Contact</NuxtLink></li>
                <li><span class="cursor-not-allowed opacity-50">Documentation</span></li>
                <li><span class="cursor-not-allowed opacity-50">FAQ</span></li>
              </ul>
            </div>

            <div>
              <h4 class="font-semibold mb-3 text-sm">
                Legal
              </h4>
              <ul class="space-y-2 text-sm text-muted">
                <li><NuxtLink to="/privacy" class="hover:text-default transition-colors">Privacy Policy</NuxtLink></li>
                <li><NuxtLink to="/terms" class="hover:text-default transition-colors">Terms of Service</NuxtLink></li>
              </ul>
            </div>
          </div>

          <div class="pt-8 border-t border-default flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-sm text-muted">
              &copy; 2025 BORING Meal Planner. All rights reserved.
            </p>
            <div class="flex items-center gap-4">
              <UColorModeButton />
            </div>
          </div>
        </div>
      </footer>
    </div>
  </UApp>
</template>
