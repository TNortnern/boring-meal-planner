<script setup lang="ts">
definePageMeta({
  layout: 'onboarding'
})

const { state, totalSteps, progress, canProceed, nextStep, prevStep } = useOnboarding()
const _router = useRouter()

const stepTitles = [
  'What\'s your goal?',
  'Tell us about yourself',
  'How active are you?',
  'Any dietary restrictions?',
  'Your preferences',
  'Your plan is ready'
]

const handleComplete = async () => {
  // TODO: Save to backend and redirect to dashboard
  await navigateTo('/dashboard')
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- Progress bar -->
    <div class="mb-8">
      <div class="flex justify-between text-sm text-muted mb-2">
        <span>Step {{ state.step }} of {{ totalSteps }}</span>
        <span>{{ Math.round(progress) }}%</span>
      </div>
      <UProgress :model-value="progress" size="sm" />
    </div>

    <!-- Step title -->
    <h1 class="text-2xl font-semibold mb-6">
      {{ stepTitles[state.step - 1] }}
    </h1>

    <!-- Step content -->
    <div class="min-h-[300px]">
      <OnboardingStepGoal v-if="state.step === 1" />
      <OnboardingStepStats v-else-if="state.step === 2" />
      <OnboardingStepActivity v-else-if="state.step === 3" />
      <OnboardingStepDiet v-else-if="state.step === 4" />
      <OnboardingStepPreferences v-else-if="state.step === 5" />
      <OnboardingStepSummary v-else-if="state.step === 6" />
    </div>

    <!-- Navigation -->
    <div class="flex justify-between mt-8 pt-6 border-t border-default">
      <UButton
        v-if="state.step > 1"
        variant="ghost"
        color="neutral"
        icon="i-lucide-arrow-left"
        @click="prevStep"
      >
        Back
      </UButton>
      <div v-else />

      <UButton
        v-if="state.step < totalSteps"
        :disabled="!canProceed"
        trailing-icon="i-lucide-arrow-right"
        @click="nextStep"
      >
        Continue
      </UButton>
      <UButton
        v-else
        :disabled="!canProceed"
        trailing-icon="i-lucide-check"
        @click="handleComplete"
      >
        Start My Plan
      </UButton>
    </div>
  </div>
</template>
