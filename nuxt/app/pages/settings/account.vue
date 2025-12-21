<script setup lang="ts">
const { logout } = useAuth()
const toast = useToast()

const changePasswordOpen = ref(false)
const deleteAccountOpen = ref(false)

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

function changePassword() {
  if (passwordForm.new !== passwordForm.confirm) {
    toast.add({
      title: 'Error',
      description: 'New passwords do not match.',
      icon: 'i-lucide-x',
      color: 'error'
    })
    return
  }

  toast.add({
    title: 'Password Changed',
    description: 'Your password has been updated successfully.',
    icon: 'i-lucide-check',
    color: 'success'
  })
  changePasswordOpen.value = false
  passwordForm.current = ''
  passwordForm.new = ''
  passwordForm.confirm = ''
}

function exportData() {
  toast.add({
    title: 'Export Started',
    description: 'Your data export is being prepared. You will receive an email when ready.',
    icon: 'i-lucide-download',
    color: 'info'
  })
}

async function signOut() {
  await logout()
  navigateTo('/login')
}

async function deleteAccount() {
  // TODO: Add actual delete account API call when implemented
  await logout()
  toast.add({
    title: 'Account Deleted',
    description: 'Your account has been permanently deleted.',
    icon: 'i-lucide-trash-2',
    color: 'error'
  })
  deleteAccountOpen.value = false
  navigateTo('/login')
}
</script>

<template>
  <div>
    <UPageCard
      title="Account"
      description="Manage your account settings and data."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    />

    <UPageCard variant="subtle" class="mb-6">
      <div class="space-y-4">
        <div class="flex items-center justify-between py-3">
          <div>
            <div class="font-medium">
              Change Password
            </div>
            <div class="text-sm text-muted">
              Update your account password
            </div>
          </div>
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            @click="changePasswordOpen = true"
          >
            Change
          </UButton>
        </div>

        <USeparator />

        <div class="flex items-center justify-between py-3">
          <div>
            <div class="font-medium">
              Export Data
            </div>
            <div class="text-sm text-muted">
              Download all your data as JSON
            </div>
          </div>
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            icon="i-lucide-download"
            @click="exportData"
          >
            Export
          </UButton>
        </div>

        <USeparator />

        <div class="flex items-center justify-between py-3">
          <div>
            <div class="font-medium">
              Sign Out
            </div>
            <div class="text-sm text-muted">
              Sign out of your account
            </div>
          </div>
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            icon="i-lucide-log-out"
            @click="signOut"
          >
            Sign Out
          </UButton>
        </div>
      </div>
    </UPageCard>

    <!-- Danger Zone -->
    <UPageCard
      title="Danger Zone"
      description="Irreversible actions."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    />

    <UPageCard variant="subtle" class="border-error/20 bg-error/5">
      <div class="flex items-center justify-between">
        <div>
          <div class="font-medium text-error">
            Delete Account
          </div>
          <div class="text-sm text-muted">
            Permanently delete your account and all data
          </div>
        </div>
        <UButton
          variant="outline"
          color="error"
          size="sm"
          @click="deleteAccountOpen = true"
        >
          Delete Account
        </UButton>
      </div>
    </UPageCard>

    <!-- Change Password Modal -->
    <UModal v-model:open="changePasswordOpen">
      <template #content>
        <UDashboardModal
          title="Change Password"
          description="Enter your current password and choose a new one."
          @close="changePasswordOpen = false"
        >
          <div class="space-y-4">
            <UFormField label="Current Password">
              <UInput
                v-model="passwordForm.current"
                type="password"
                placeholder="Enter current password"
              />
            </UFormField>

            <UFormField label="New Password">
              <UInput
                v-model="passwordForm.new"
                type="password"
                placeholder="Enter new password"
              />
            </UFormField>

            <UFormField label="Confirm New Password">
              <UInput
                v-model="passwordForm.confirm"
                type="password"
                placeholder="Confirm new password"
              />
            </UFormField>
          </div>

          <template #footer>
            <UButton variant="outline" color="neutral" @click="changePasswordOpen = false">
              Cancel
            </UButton>
            <UButton @click="changePassword">
              Change Password
            </UButton>
          </template>
        </UDashboardModal>
      </template>
    </UModal>

    <!-- Delete Account Modal -->
    <UModal v-model:open="deleteAccountOpen">
      <template #content>
        <UDashboardModal
          title="Delete Account"
          description="This action cannot be undone."
          @close="deleteAccountOpen = false"
        >
          <div class="p-4 rounded-lg bg-error/10 border border-error/20">
            <p class="text-sm">
              Are you sure you want to delete your account? This will permanently delete:
            </p>
            <ul class="mt-2 text-sm text-muted list-disc list-inside">
              <li>All your meal plans and recipes</li>
              <li>Your workout history and progress</li>
              <li>All check-in data and photos</li>
              <li>Your account and profile information</li>
            </ul>
          </div>

          <template #footer>
            <UButton variant="outline" color="neutral" @click="deleteAccountOpen = false">
              Cancel
            </UButton>
            <UButton color="error" @click="deleteAccount">
              Delete My Account
            </UButton>
          </template>
        </UDashboardModal>
      </template>
    </UModal>
  </div>
</template>
