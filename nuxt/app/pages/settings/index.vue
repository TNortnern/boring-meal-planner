<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { user, updateProfile } = useAuth()
const toast = useToast()

const profileSchema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.string().email('Invalid email'),
  sex: z.enum(['male', 'female', 'unspecified']),
  age: z.number().min(16).max(100),
  heightFeet: z.number().min(4).max(7),
  heightInches: z.number().min(0).max(11),
  weightLbs: z.number().min(80).max(500),
  liftingDays: z.number().min(0).max(7),
  dailySteps: z.number().min(0).max(30000),
  cardioMinutes: z.number().min(0).max(120)
})

type ProfileSchema = z.output<typeof profileSchema>

// Convert cm to feet/inches for display
const cmToFeetInches = (cm: number | undefined): { feet: number, inches: number } => {
  if (!cm) return { feet: 5, inches: 8 }
  const totalInches = cm / 2.54
  const feet = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches % 12)
  return { feet, inches }
}

// Convert kg to lbs for display
const kgToLbs = (kg: number | undefined): number => {
  if (!kg) return 150
  return Math.round(kg * 2.20462)
}

// Initialize from user data
const heightDisplay = computed(() => cmToFeetInches(user.value?.height?.value))

const profile = reactive<Partial<ProfileSchema>>({
  name: user.value?.name || '',
  email: user.value?.email || '',
  sex: user.value?.sex || 'unspecified',
  age: user.value?.age || 30,
  heightFeet: heightDisplay.value.feet,
  heightInches: heightDisplay.value.inches,
  weightLbs: kgToLbs(user.value?.currentWeight?.value),
  liftingDays: user.value?.liftingDaysPerWeek || 4,
  dailySteps: user.value?.dailyStepsEstimate || 8000,
  cardioMinutes: 20
})

// Update profile when user data loads
watch(user, (newUser) => {
  if (newUser) {
    const ht = cmToFeetInches(newUser.height?.value)
    profile.name = newUser.name || ''
    profile.email = newUser.email || ''
    profile.sex = newUser.sex || 'unspecified'
    profile.age = newUser.age || 30
    profile.heightFeet = ht.feet
    profile.heightInches = ht.inches
    profile.weightLbs = kgToLbs(newUser.currentWeight?.value)
    profile.liftingDays = newUser.liftingDaysPerWeek || 4
    profile.dailySteps = newUser.dailyStepsEstimate || 8000
  }
}, { immediate: true })

async function onSubmit(_event: FormSubmitEvent<ProfileSchema>) {
  // Convert feet/inches to cm
  const heightCm = ((profile.heightFeet || 5) * 12 + (profile.heightInches || 0)) * 2.54
  // Convert lbs to kg
  const weightKg = (profile.weightLbs || 150) * 0.453592

  const result = await updateProfile({
    name: profile.name,
    sex: profile.sex,
    age: profile.age,
    height: { value: heightCm, unit: 'cm' },
    currentWeight: { value: weightKg, unit: 'kg' },
    liftingDaysPerWeek: profile.liftingDays,
    dailyStepsEstimate: profile.dailySteps
  })

  if (result.success) {
    toast.add({
      title: 'Profile Updated',
      description: 'Your profile settings have been saved.',
      icon: 'i-lucide-check',
      color: 'success'
    })
  } else {
    toast.add({
      title: 'Error',
      description: result.error || 'Failed to save profile',
      icon: 'i-lucide-x',
      color: 'error'
    })
  }
}

const sexOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unspecified', label: 'Prefer not to say' }
]
</script>

<template>
  <UForm
    id="profile-settings"
    :schema="profileSchema"
    :state="profile"
    @submit="onSubmit"
  >
    <UPageCard
      title="Profile"
      description="Your personal information and body stats."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        form="profile-settings"
        label="Save changes"
        color="neutral"
        type="submit"
        class="w-fit lg:ms-auto"
      />
    </UPageCard>

    <UPageCard variant="subtle">
      <UFormField
        name="name"
        label="Name"
        description="Your display name."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput v-model="profile.name" autocomplete="off" />
      </UFormField>

      <USeparator />

      <UFormField
        name="email"
        label="Email"
        description="Your email address for notifications."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput v-model="profile.email" type="email" autocomplete="off" />
      </UFormField>

      <USeparator />

      <UFormField
        name="sex"
        label="Sex"
        description="Used for accurate calorie calculations."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <USelect
          v-model="profile.sex"
          :items="sexOptions"
          value-key="value"
          label-key="label"
          class="w-48"
        />
      </UFormField>

      <USeparator />

      <UFormField
        name="age"
        label="Age"
        description="Your age in years."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model.number="profile.age"
          type="number"
          min="16"
          max="100"
          class="w-24"
        />
      </UFormField>
    </UPageCard>

    <UPageCard
      title="Body Stats"
      description="Your current measurements."
      variant="naked"
      orientation="horizontal"
      class="mt-8 mb-4"
    />

    <UPageCard variant="subtle">
      <UFormField
        name="heightFeet"
        label="Height"
        description="Your height in feet and inches."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <div class="flex items-center gap-2">
          <UInput
            v-model.number="profile.heightFeet"
            type="number"
            min="4"
            max="7"
            class="w-20"
          />
          <span class="text-muted">ft</span>
          <UInput
            v-model.number="profile.heightInches"
            type="number"
            min="0"
            max="11"
            class="w-20"
          />
          <span class="text-muted">in</span>
        </div>
      </UFormField>

      <USeparator />

      <UFormField
        name="weightLbs"
        label="Weight"
        description="Your current body weight."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <div class="flex items-center gap-2">
          <UInput
            v-model.number="profile.weightLbs"
            type="number"
            min="80"
            max="500"
            class="w-24"
          />
          <span class="text-muted">lbs</span>
        </div>
      </UFormField>
    </UPageCard>

    <UPageCard
      title="Body Composition"
      description="Track your body measurements and composition."
      variant="naked"
      orientation="horizontal"
      class="mt-8 mb-4"
    />

    <UPageCard variant="subtle">
      <div class="grid grid-cols-2 gap-4">
        <UFormField
          label="Waist"
          description="Measured at navel"
        >
          <div class="flex items-center gap-2">
            <UInput
              type="number"
              step="0.25"
              placeholder="0.0"
              class="w-24"
            />
            <span class="text-muted">inches</span>
          </div>
        </UFormField>

        <UFormField
          label="Chest"
          description="At widest point"
        >
          <div class="flex items-center gap-2">
            <UInput
              type="number"
              step="0.25"
              placeholder="0.0"
              class="w-24"
            />
            <span class="text-muted">inches</span>
          </div>
        </UFormField>

        <UFormField
          label="Arms"
          description="Flexed bicep"
        >
          <div class="flex items-center gap-2">
            <UInput
              type="number"
              step="0.25"
              placeholder="0.0"
              class="w-24"
            />
            <span class="text-muted">inches</span>
          </div>
        </UFormField>

        <UFormField
          label="Thighs"
          description="At widest point"
        >
          <div class="flex items-center gap-2">
            <UInput
              type="number"
              step="0.25"
              placeholder="0.0"
              class="w-24"
            />
            <span class="text-muted">inches</span>
          </div>
        </UFormField>
      </div>

      <USeparator />

      <UFormField
        label="Body Fat %"
        description="Optional: From calipers, DEXA, or other measurement"
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <div class="flex items-center gap-2">
          <UInput
            type="number"
            step="0.1"
            placeholder="0.0"
            class="w-24"
          />
          <span class="text-muted">%</span>
        </div>
      </UFormField>
    </UPageCard>

    <UPageCard
      title="Activity Level"
      description="Your weekly training schedule."
      variant="naked"
      orientation="horizontal"
      class="mt-8 mb-4"
    />

    <UPageCard variant="subtle">
      <UFormField
        name="liftingDays"
        label="Lifting Days"
        description="Days per week you weight train."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model.number="profile.liftingDays"
          type="number"
          min="0"
          max="7"
          class="w-24"
        />
      </UFormField>

      <USeparator />

      <UFormField
        name="dailySteps"
        label="Daily Steps"
        description="Average daily step count."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model.number="profile.dailySteps"
          type="number"
          min="0"
          max="30000"
          step="500"
          class="w-28"
        />
      </UFormField>

      <USeparator />

      <UFormField
        name="cardioMinutes"
        label="Cardio"
        description="Minutes of cardio per day."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <div class="flex items-center gap-2">
          <UInput
            v-model.number="profile.cardioMinutes"
            type="number"
            min="0"
            max="120"
            class="w-24"
          />
          <span class="text-muted">min/day</span>
        </div>
      </UFormField>
    </UPageCard>
  </UForm>
</template>
