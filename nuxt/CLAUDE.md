# CLAUDE.md — UI/UX Standards

## Philosophy
The best UI feels **quietly confident**: nothing extra, nothing missing, everything where users expect it.

## Core Principles
- **Clarity first** — Users understand what to do in 3 seconds
- **Familiar patterns** — Use conventions users know
- **Calm UI** — Restrained color, strong hierarchy, generous whitespace
- **High craft** — Pixel-tight alignment, consistent spacing, polished details

---

## Spacing Scale (No Random Numbers)
Use only: **4 / 8 / 12 / 16 / 24 / 32 / 48 / 64**

| Context | Value |
|---------|-------|
| Inside components (padding) | 12–16 |
| Between related items | 8–12 |
| Between sections | 24–32 |
| Page gutters (mobile) | 16 |
| Page gutters (desktop) | 24–32 |

---

## Dashboard & Page Content

### Horizontal Padding (Required)
All `UDashboardPanelContent` must have horizontal padding:
```vue
<UDashboardPanelContent class="px-4 sm:px-6 lg:px-8">
```

### Content Max Width
- Main content: `max-w-6xl` or `max-w-7xl`
- Forms/focused content: `max-w-2xl`

---

## Dialogs & Modals (Critical Standards)

### Required Elements
1. **Close button** — Always include X button in top-right
2. **Consistent padding** — `p-6` minimum, `space-y-6` for content
3. **Full-width inputs** — All form inputs must be `w-full`
4. **Clear title** — States intent ("Edit Workout", "Add Check-in")
5. **Footer actions** — Cancel (left/ghost) + Primary action (right)

### Modal Structure Template
```vue
<UModal v-model:open="isOpen">
  <template #content>
    <UCard>
      <!-- Header with close button -->
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Modal Title</h3>
          <UButton
            icon="i-lucide-x"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="isOpen = false"
          />
        </div>
      </template>

      <!-- Content with proper spacing -->
      <div class="space-y-4">
        <!-- Full-width inputs -->
        <UFormField label="Field">
          <UInput v-model="value" class="w-full" />
        </UFormField>
      </div>

      <!-- Footer with actions -->
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton variant="ghost" color="neutral" @click="isOpen = false">
            Cancel
          </UButton>
          <UButton @click="save">
            Save
          </UButton>
        </div>
      </template>
    </UCard>
  </template>
</UModal>
```

### UDashboardModal Alternative
When using `UDashboardModal`, ensure:
- Pass `@close` handler
- Use `class="w-full"` on all inputs
- Wrap content in `<div class="space-y-4">`

---

## Forms & Inputs

### Input Width Rules
- **Dialogs/Modals**: Always `w-full`
- **Inline forms**: Size appropriately (`w-24`, `w-32`, etc.)
- **Grid layouts**: Use grid columns, not fixed widths

### Form Field Spacing
```vue
<div class="space-y-4">
  <UFormField label="Label">
    <UInput v-model="value" class="w-full" />
  </UFormField>
</div>
```

### Two-Column Forms
```vue
<div class="grid grid-cols-2 gap-4">
  <UFormField label="First">
    <UInput v-model="first" />
  </UFormField>
  <UFormField label="Second">
    <UInput v-model="second" />
  </UFormField>
</div>
```

---

## Cards & Containers

### Card Padding
- Default: `p-4` (16px)
- Comfortable: `p-6` (24px)
- Compact: `p-3` (12px)

### Card Structure
```vue
<div class="p-4 rounded-xl bg-elevated border border-default">
  <!-- content -->
</div>
```

---

## Typography Hierarchy
1. Page title — `text-2xl font-semibold`
2. Section header — `text-lg font-semibold`
3. Card header — `font-medium`
4. Body — default
5. Caption/helper — `text-sm text-muted`

---

## Buttons

### Hierarchy
- **Primary**: One per view, main action
- **Secondary/Outline**: Supporting actions
- **Ghost**: Tertiary, cancel, close

### Labels
- Use verbs: "Save Changes", "Add Entry", "Start Workout"
- Destructive: Red color, confirmation required

---

## States (Every Screen Needs)
- Loading skeleton or spinner
- Empty state with next step
- Error state with recovery action
- Success feedback (toast)

---

## Nuxt UI Specifics

### UProgress
Always use `:model-value`, never `:value`:
```vue
<UProgress :model-value="progress" />
```

### UModal with UDashboardModal
```vue
<UModal v-model:open="open">
  <template #content>
    <UDashboardModal
      title="Title"
      description="Description"
      @close="open = false"
    >
      <div class="space-y-4">
        <!-- content -->
      </div>
      <template #footer>
        <UButton variant="outline" @click="open = false">Cancel</UButton>
        <UButton @click="save">Save</UButton>
      </template>
    </UDashboardModal>
  </template>
</UModal>
```

---

## QA Checklist
Before shipping any UI:
- [ ] Alignment: edges line up, spacing consistent
- [ ] Dialogs: have close button, padded content, full-width inputs
- [ ] Dashboard: horizontal padding on content
- [ ] Primary action: obvious and unique
- [ ] Forms: labels visible, inputs full-width in modals
- [ ] States: loading/empty/error handled
- [ ] Mobile: no cramped touch targets
