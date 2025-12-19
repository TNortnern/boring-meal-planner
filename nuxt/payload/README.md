# BORING Meal Planner - Payload CMS Backend

This is the Payload CMS backend for the BORING Meal Planner application.

## Features

- **User Management**: Authentication, profiles, and preferences
- **Meal Planning**: 7-day meal plans with recipe tracking
- **Recipes**: Full recipe database with nutritional information
- **Workouts**: Custom workout plans and exercise tracking
- **Progress Tracking**: Weight, measurements, and progress photos
- **Media Management**: Image uploads with optional Bunny CDN storage

## Collections

### Users
- Authentication with email/password
- Profile fields: age, sex, height, weight, goal, activity level
- Macro targets: calories, protein, carbs, fat
- Preferences: boring mode, meals per day, allergies, dietary pattern

### MealPlans
- 7-day meal plans linked to users
- Each day has multiple meals (breakfast, lunch, dinner, snacks)
- Track eaten status and timing for each meal

### Recipes
- Recipe name, description, and category
- Ingredients and step-by-step instructions
- Full nutritional information (calories, protein, carbs, fat, fiber)
- Prep/cook time and servings
- Tagging system for filtering

### Workouts
- Workout plans with custom splits (PPL, Upper/Lower, Full Body, etc.)
- Exercise tracking with sets, reps, and rest times
- Workout session history with performance logs

### Progress
- Weight tracking over time
- Body measurements (waist, chest, arms, thighs, body fat %)
- Progress photos with dates and notes

### Media
- Image uploads with automatic resizing
- Optional Bunny CDN integration for cloud storage
- Alt text for accessibility

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database and configuration details.

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Access the admin panel at `http://localhost:3000/admin`

## Database Setup

This project uses PostgreSQL with the Payload CMS database adapter.

### Local Development
```bash
# Create a database
createdb boring_meal_planner

# Set DATABASE_URI in .env
DATABASE_URI=postgresql://user:password@localhost:5432/boring_meal_planner
```

### Production
Set the appropriate environment variables for your PostgreSQL instance.

## Bunny CDN (Optional)

To enable Bunny CDN for media storage:

1. Set up a Bunny Storage Zone and Pull Zone
2. Configure environment variables:
   ```
   BUNNY_STORAGE_ENABLED=true
   BUNNY_STORAGE_ZONE=your-storage-zone
   BUNNY_API_KEY=your-bunny-api-key
   BUNNY_CDN_URL=https://your-zone.b-cdn.net
   ```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm generate:types` - Generate TypeScript types
- `pnpm generate:importmap` - Generate import map
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking

## Tech Stack

- **Payload CMS**: 3.64.0
- **Next.js**: 15.5.9
- **PostgreSQL**: Database adapter
- **Lexical**: Rich text editor
- **Sharp**: Image processing
- **React**: 19.1.0

## License

MIT
