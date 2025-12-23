# BORING Meal Planner - Development Guide

## Project Overview

A meal planning web app that prioritizes simplicity and effectiveness over variety. Users set goals (cut/maintain/gain), receive locked macro targets, and follow boring but consistent meal plans.

**Production URL:** https://app-production-3934.up.railway.app/

**Test Account (for browser automation testing):**
- Email: test@boringmealplanner.com
- Password: TestBoring123!

**Local Tools:**
- Bun installed (use for running scripts)
- Dev Browser plugin for browser automation testing

**Tech Stack:**
- **Frontend:** Nuxt 4 + Nuxt UI v4 + TypeScript
- **Backend:** Payload CMS 3.x + PostgreSQL
- **Infrastructure:** Docker Compose monorepo, Railway deployment

## Critical Development Rules

### Pre-Commit Requirements

**ALL checks must pass before commits. No exceptions. No `--no-verify`.**

```bash
pnpm typecheck  # TypeScript must pass
pnpm lint       # ESLint must pass
pnpm test       # Vitest tests must pass
```

The pre-commit hook enforces this automatically. If you're tempted to skip it, fix the issue instead.

### Unit Testing Requirements

**Every feature MUST have accompanying tests.**

- Use Vitest with `@nuxt/test-utils`
- Place tests in `tests/unit/` directories
- Use `.nuxt.test.ts` suffix for tests needing Nuxt runtime
- Aim for meaningful coverage, not 100% line coverage
- Test behavior, not implementation details

```typescript
// Good: Tests behavior
it('calculates daily calories correctly for cutting goal', () => {
  const result = calculateMacros({ goal: 'cut', weight: 80, activity: 4 })
  expect(result.calories).toBeLessThan(2000)
})

// Bad: Tests implementation
it('calls the helper function', () => {
  expect(helperFn).toHaveBeenCalled()
})
```

### TypeScript Strictness

- `strict: true` is mandatory
- No `any` types without explicit justification
- All function parameters and returns must be typed
- Use Zod for runtime validation at boundaries

## Design Philosophy

### Frontend Design Standards

**This app must NOT look like AI slop.** Use the `frontend-design` plugin for:
- Custom color palettes beyond defaults
- Thoughtful spacing and typography
- Subtle animations and micro-interactions
- Cohesive visual language

**Design Tokens (app.config.ts):**
```typescript
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'emerald',    // Health/growth
      secondary: 'slate',    // Neutral/boring (on purpose)
      neutral: 'zinc'
    }
  }
})
```

### BORING Mode Philosophy

The app intentionally limits choice to reduce decision fatigue:
- Same meals daily (or A/B rotation max)
- No fasting suggestions
- No cheat meals
- No "eat back" calories
- Consistent sodium/water

## Nuxt UI v4 Rules

### Critical Breaking Changes (v2 → v3/v4)

**Component Renames:**
- `UDivider` → `USeparator`
- `UDropdown` → `UDropdownMenu`
- `UFormGroup` → `UFormField`
- `URange` → `USlider`
- `UToggle` → `USwitch`
- `UNotification` → `UToast`
- `UVerticalNavigation` → `UNavigationMenu` (with `orientation` prop)

**Prop Changes:**
- `options` → `items` (USelect, UBreadcrumb, UNavigationMenu)
- `links` → `items` across components
- `timeout` → `duration` (toast composable)
- `click` → `onClick` in item objects

**Modal/Slideover:**
- Use `v-model:open` instead of `v-model`
- Use structured slots: `#content`, `#header`, `#body`, `#footer`

### Required Patterns

**Always wrap app with UApp:**
```vue
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

**Use semantic colors, not Tailwind defaults:**
```vue
<!-- Good -->
<UButton color="primary">Save</UButton>
<p class="text-muted">Helper text</p>

<!-- Bad -->
<UButton color="green">Save</UButton>
<p class="text-gray-500">Helper text</p>
```

**Design Tokens for theming:**
- `text-dimmed`, `text-muted`, `text-toned`, `text-default`, `text-highlighted`
- `bg-default`, `bg-muted`, `bg-elevated`, `bg-accented`
- `border-default`, `border-muted`, `border-accented`

### Common Mistakes to Avoid

1. Using v2 component names
2. Omitting `UApp` wrapper
3. Using Tailwind colors instead of semantic aliases
4. Manual dark mode classes instead of design tokens
5. Old composable APIs (`useModal` vs `useOverlay`)
6. Missing slot structure in overlays

## Payload CMS Patterns

### Collection Structure

Collections are in `payload/src/collections/`:
- `Users.ts` - User profiles with goals and preferences
- `Recipes.ts` - Boring meal recipes (max 10 ingredients)
- `Ingredients.ts` - Base ingredients with macros
- `Exercises.ts` - Exercise library with muscle maps
- `MealPlans.ts` - Weekly meal assignments
- `WorkoutPlans.ts` - Training split templates
- `ProgressLogs.ts` - Daily/weekly tracking

### API Access Pattern

Nuxt proxies Payload admin at `/admin/**`. API calls go through Nuxt server routes:

```typescript
// server/api/recipes/index.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const response = await $fetch(`${config.payloadApiUrl}/api/recipes`, {
    headers: { Authorization: `Bearer ${config.payloadApiKey}` }
  })
  return response
})
```

## File Structure

```
/
├── nuxt/                    # Nuxt frontend
│   ├── app/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── layouts/
│   │   └── pages/
│   ├── server/
│   │   └── api/
│   └── tests/
│       └── unit/
├── payload/                 # Payload CMS backend
│   └── src/
│       ├── collections/
│       ├── globals/
│       ├── hooks/
│       └── lib/
├── docker-compose.yml
└── CLAUDE.md
```

## Commands

```bash
# Development
pnpm dev                 # Start via Docker Compose
pnpm dev:nuxt           # Nuxt only (needs Payload running)
pnpm dev:payload        # Payload only (needs Postgres)

# Testing
pnpm test               # Run all tests
pnpm test:nuxt          # Nuxt tests only
pnpm test:payload       # Payload tests only

# Quality
pnpm typecheck          # TypeScript validation
pnpm lint               # ESLint
pnpm lint:fix           # Auto-fix lint issues

# Build
pnpm build              # Build all packages
```

## Environment Variables

Copy `.env.example` to `.env`:

```bash
PAYLOAD_SECRET=your-secret-here
PAYLOAD_API_KEY=optional-for-auth
```

## Plugin Usage

### frontend-design Plugin
Use for all UI work. Invoke when:
- Creating new pages or components
- Designing layouts
- Implementing visual features

### payload Plugin
Use for Payload CMS work. Invoke when:
- Creating or modifying collections
- Setting up hooks or access control
- Working with Payload's admin customization

## Data Model Summary

### User Goals → Macro Calculation

```
Input: weight, height, goal, activity, aggression
Output: { calories, protein, carbs, fat }
```

### Plateau Protocol

If weight AND waist stall for 14 days:
1. Add +10 min cardio OR
2. Reduce 100-150 calories (from carbs)
Never both at once.

### Recipe Constraints

- Max 10 ingredients per recipe
- Prep time 10-25 minutes
- Boring score 1-10 (higher = simpler)
- Must have macros per serving calculated

## Testing Checklist

Before any PR:
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes
- [ ] New features have tests
- [ ] No `--no-verify` commits
- [ ] No `any` types added
- [ ] Semantic colors used (not Tailwind defaults)
