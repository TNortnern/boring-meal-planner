<script setup lang="ts">
const { state } = useOnboarding()

const sexOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unspecified', label: 'Prefer not to say' }
] as const
</script>

<template>
  <div class="space-y-6">
    <!-- Sex -->
    <UFormField label="Biological sex" hint="Used for metabolism calculation">
      <div class="flex gap-2">
        <UButton
          v-for="option in sexOptions"
          :key="option.value"
          :variant="state.sex === option.value ? 'solid' : 'outline'"
          :color="state.sex === option.value ? 'primary' : 'neutral'"
          size="sm"
          @click="state.sex = option.value"
        >
          {{ option.label }}
        </UButton>
      </div>
    </UFormField>

    <!-- Age -->
    <UFormField label="Age" hint="Optional but improves accuracy">
      <UInput
        v-model.number="state.age"
        type="number"
        placeholder="30"
        :min="13"
        :max="120"
        class="max-w-32"
      />
    </UFormField>

    <!-- Height -->
    <UFormField label="Height">
      <div class="flex gap-2">
        <template v-if="state.height.unit === 'ft'">
          <UInput
            v-model.number="state.height.feet"
            type="number"
            placeholder="5"
            :min="0"
            :max="8"
            class="flex-1"
          />
          <span class="flex items-center text-sm text-muted">ft</span>
          <UInput
            v-model.number="state.height.inches"
            type="number"
            placeholder="11"
            :min="0"
            :max="11"
            class="flex-1"
          />
          <span class="flex items-center text-sm text-muted">in</span>
        </template>
        <UInput
          v-else
          v-model.number="state.height.value"
          type="number"
          :placeholder="state.height.unit === 'cm' ? '175' : '69'"
          class="flex-1"
        />
        <div class="inline-flex rounded-md overflow-hidden border border-default">
          <UButton
            :variant="state.height.unit === 'cm' ? 'solid' : 'ghost'"
            :color="state.height.unit === 'cm' ? 'primary' : 'neutral'"
            size="sm"
            class="rounded-none"
            @click="state.height.unit = 'cm'"
          >
            cm
          </UButton>
          <UButton
            :variant="state.height.unit === 'in' ? 'solid' : 'ghost'"
            :color="state.height.unit === 'in' ? 'primary' : 'neutral'"
            size="sm"
            class="rounded-none"
            @click="state.height.unit = 'in'"
          >
            in
          </UButton>
          <UButton
            :variant="state.height.unit === 'ft' ? 'solid' : 'ghost'"
            :color="state.height.unit === 'ft' ? 'primary' : 'neutral'"
            size="sm"
            class="rounded-none"
            @click="state.height.unit = 'ft'"
          >
            ft
          </UButton>
        </div>
      </div>
    </UFormField>

    <!-- Weight -->
    <UFormField label="Current weight">
      <div class="flex gap-2">
        <UInput
          v-model.number="state.weight.value"
          type="number"
          :placeholder="state.weight.unit === 'kg' ? '80' : '176'"
          class="flex-1"
        />
        <div class="inline-flex rounded-md overflow-hidden border border-default">
          <UButton
            :variant="state.weight.unit === 'kg' ? 'solid' : 'ghost'"
            :color="state.weight.unit === 'kg' ? 'primary' : 'neutral'"
            size="sm"
            class="rounded-none"
            @click="state.weight.unit = 'kg'"
          >
            kg
          </UButton>
          <UButton
            :variant="state.weight.unit === 'lbs' ? 'solid' : 'ghost'"
            :color="state.weight.unit === 'lbs' ? 'primary' : 'neutral'"
            size="sm"
            class="rounded-none"
            @click="state.weight.unit = 'lbs'"
          >
            lbs
          </UButton>
        </div>
      </div>
    </UFormField>

    <!-- Body Fat Percentage -->
    <UFormField label="Body fat percentage" hint="Optional - helps improve accuracy">
      <div class="flex gap-2 items-center">
        <UInput
          v-model.number="state.bodyFat"
          type="number"
          placeholder="15"
          :min="5"
          :max="50"
          class="max-w-32"
        />
        <span class="text-sm text-muted">%</span>
        <UButton
          v-if="state.bodyFat !== null"
          variant="ghost"
          color="neutral"
          size="xs"
          @click="state.bodyFat = null"
        >
          I don't know
        </UButton>
      </div>
    </UFormField>
  </div>
</template>
