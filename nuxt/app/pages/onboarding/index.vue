<script setup lang="ts">
definePageMeta({
  layout: 'onboarding'
})

const { state, totalSteps, progress, canProceed, nextStep, prevStep, getHeightCm, getWeightKg } = useOnboarding()
const { updateProfile, user } = useAuth()
const toast = useToast()
const _router = useRouter()

const stepTitles = [
  'Welcome! Let\'s start',
  'What\'s your goal?',
  'Tell us about yourself',
  'How active are you?',
  'Any dietary restrictions?',
  'Your preferences',
  'Your plan is ready'
]

const handleComplete = async () => {
  // Save all onboarding data to user profile
  if (user.value) {
    const result = await updateProfile({
      name: state.value.name,
      email: state.value.email,
      age: state.value.age || undefined,
      sex: state.value.sex,
      height: getHeightCm(),
      weight: getWeightKg(),
      goal: state.value.goal,
      macroTargets: state.value.macroTargets || undefined,
      preferences: {
        boringMode: state.value.boringLevel === 'maximum_boring' || state.value.boringLevel === 'very_boring',
        mealsPerDay: state.value.mealsPerDay,
        allergies: state.value.allergies,
        dietaryPattern: state.value.dietaryPattern
      }
    })

    if (result.success) {
      toast.add({
        title: 'Profile saved!',
        description: 'Your personalized plan is ready',
        color: 'success'
      })
    } else {
      toast.add({
        title: 'Warning',
        description: 'Could not save profile, but you can continue',
        color: 'warning'
      })
    }
  }

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
      <OnboardingStepUserInfo v-if="state.step === 1" />
      <OnboardingStepGoal v-else-if="state.step === 2" />
      <OnboardingStepStats v-else-if="state.step === 3" />
      <OnboardingStepActivity v-else-if="state.step === 4" />
      <OnboardingStepDiet v-else-if="state.step === 5" />
      <OnboardingStepPreferences v-else-if="state.step === 6" />
      <OnboardingStepSummary v-else-if="state.step === 7" />
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
