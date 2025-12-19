# BORING Meal Planner - QA Testing Guide
**Date:** December 19, 2025
**Version:** 1.0.0
**Prepared for:** Full Application QA Testing

---

## DEPLOYMENT & ACCESS INFORMATION

### Deployed URL
```
https://[YOUR-DEPLOYED-URL-HERE]
```
> **Note:** Replace with actual deployment URL before testing

### Local Development (Docker)
```bash
# Start the full stack (PostgreSQL + Payload + Nuxt)
docker-compose up

# Services:
# - Nuxt Frontend: http://localhost:3009
# - Payload Admin: http://localhost:3010/admin
# - PostgreSQL: localhost:5434
```

### Local Development (Without Docker)
```bash
# Terminal 1: Start PostgreSQL (via Docker or local install)
docker run -d --name boring_postgres -p 5434:5432 \
  -e POSTGRES_USER=boring_user \
  -e POSTGRES_PASSWORD=boring_password \
  -e POSTGRES_DB=boring_db \
  postgres:16-alpine

# Terminal 2: Start Payload CMS
cd payload && pnpm dev

# Terminal 3: Start Nuxt
pnpm dev
```

### Admin Access (Payload CMS)
```
URL: http://localhost:3010/admin
```
> Create an admin user on first run through the Payload admin interface.

---

## AUTHENTICATION SYSTEM

### Status: REAL AUTHENTICATION
The application uses **Payload CMS** with **PostgreSQL** for real authentication:

- **Email/Password Authentication** - Real user registration and login
- **JWT Tokens** - 7-day expiration, stored in localStorage
- **User Profiles** - Stored in PostgreSQL database
- **Protected Routes** - Middleware redirects unauthenticated users

### Test Credentials
Create a test user through registration:
```
Email: test@boring.app
Password: TestPassword123!
```

Or create via Payload Admin:
1. Go to http://localhost:3010/admin
2. Create first admin user
3. Navigate to Users collection
4. Create test users as needed

### Authentication Flow
1. **Register** → `/register` - Create new account
2. **Login** → `/login` - Sign in with email/password
3. **Onboarding** → `/onboarding` - Complete profile setup
4. **Dashboard** → `/dashboard` - Main authenticated app

---

## DATABASE & BACKEND

### PostgreSQL Database
- **Host:** localhost
- **Port:** 5434
- **Database:** boring_db
- **User:** boring_user
- **Password:** boring_password

### Payload CMS Collections
| Collection | Purpose |
|------------|---------|
| Users | Authentication + user profiles |
| MealPlans | Weekly meal plans per user |
| Workouts | Workout plans and sessions |
| Progress | Weight/measurements/photos |
| Recipes | Recipe database |
| Media | Image uploads |

### Bunny CDN (Photo Uploads)
- **Storage Zone:** hastest
- **CDN URL:** https://hastest.b-cdn.net
- **Status:** Configured and working

---

## TABLE OF CONTENTS

1. [Pre-Test Setup](#1-pre-test-setup)
2. [Onboarding Flow (6 Steps)](#2-onboarding-flow)
3. [Dashboard Testing](#3-dashboard-testing)
4. [Meals Page Testing](#4-meals-page-testing)
5. [Recipes Page Testing](#5-recipes-page-testing)
6. [Exercises Page Testing](#6-exercises-page-testing)
7. [Workouts Page Testing](#7-workouts-page-testing)
8. [Progress Page Testing](#8-progress-page-testing)
9. [Settings Page Testing](#9-settings-page-testing)
10. [Photo Upload Testing](#10-photo-upload-testing)
11. [UI/UX Standards Verification](#11-uiux-standards-verification)
12. [Responsive Design Testing](#12-responsive-design-testing)
13. [Data Persistence Testing](#13-data-persistence-testing)
14. [Performance Testing](#14-performance-testing)
15. [Accessibility Testing](#15-accessibility-testing)
16. [Browser Compatibility](#16-browser-compatibility)
17. [Edge Cases & Error Handling](#17-edge-cases--error-handling)
18. [Sign-Off Checklist](#18-sign-off-checklist)

---

## 1. PRE-TEST SETUP

### 1.1 Environment Preparation
- [ ] Clear browser cache and localStorage
- [ ] Open DevTools Console (check for errors throughout testing)
- [ ] Have mobile device or emulator ready
- [ ] Prepare test images (under 5MB, JPG/PNG format)

### 1.2 localStorage Keys to Monitor
Open DevTools > Application > Local Storage and monitor these keys:
```
boring-meal-plan          # Meal plan data
workouts-boring-mode      # Workout mode toggle
workouts-current-plan     # Current workout plan
progress-start-weight     # Starting weight
progress-goal-weight      # Goal weight
progress-current-weight   # Current weight
progress-weight-history   # Weight entries array
progress-measurement-history  # Measurement entries
progress-photos           # Photo URLs array
```

### 1.3 Test Data Reference
- **Test Weight:** 180 lbs
- **Test Height:** 5'10" (70 inches)
- **Test Age:** 30
- **Test Goal:** Cut (lose weight)

---

## 2. ONBOARDING FLOW

### 2.1 Step 1 - Goal Selection
**Path:** `/onboarding`

| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| OB-1.1 | Navigate to `/onboarding` | See Step 1 of 6, Goal selection screen | |
| OB-1.2 | Click "Cut" button | Button highlighted with primary color | |
| OB-1.3 | Click "Maintain" button | Selection changes, Cut deselected | |
| OB-1.4 | Click "Gain" button | Selection changes | |
| OB-1.5 | Select "Safe" aggression | Safe option highlighted | |
| OB-1.6 | Select "Aggressive" aggression | Aggressive option highlighted | |
| OB-1.7 | Set optional deadline date | Date picker works, date saved | |
| OB-1.8 | Check progress bar | Shows "Step 1 of 6" and partial fill | |
| OB-1.9 | Click "Next" without goal | Should not proceed (validation) | |
| OB-1.10 | Select goal + aggression, click Next | Proceeds to Step 2 | |

### 2.2 Step 2 - Body Stats
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| OB-2.1 | See Step 2 screen | Shows sex, age, height, weight inputs | |
| OB-2.2 | Select "Male" sex | Male button highlighted | |
| OB-2.3 | Select "Female" sex | Female button highlighted | |
| OB-2.4 | Enter age: 30 | Value accepted | |
| OB-2.5 | Enter age: 0 | Should show validation error | |
| OB-2.6 | Enter age: 150 | Should show validation error | |
| OB-2.7 | Enter height in feet/inches (5'10") | Value accepted, converts internally | |
| OB-2.8 | Enter height in cm (178) | Value accepted | |
| OB-2.9 | Enter weight: 180 lbs | Value accepted | |
| OB-2.10 | Enter weight in kg | Conversion works correctly | |
| OB-2.11 | Click "Back" | Returns to Step 1, data preserved | |
| OB-2.12 | Complete Step 2, click "Next" | Proceeds to Step 3 | |

### 2.3 Step 3 - Activity Level
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| OB-3.1 | See Step 3 screen | Shows lifting days and steps inputs | |
| OB-3.2 | Select lifting days: 0 | Value saved | |
| OB-3.3 | Select lifting days: 4 | Value saved | |
| OB-3.4 | Select lifting days: 7 | Value saved | |
| OB-3.5 | Enter daily steps: 10000 | Value accepted | |
| OB-3.6 | Click "Next" | Proceeds to Step 4 | |

### 2.4 Step 4 - Dietary Restrictions
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| OB-4.1 | See Step 4 screen | Shows allergies and diet pattern | |
| OB-4.2 | Select allergy: Dairy | Dairy button shows selected (red) | |
| OB-4.3 | Select multiple allergies | All selected allergies highlighted | |
| OB-4.4 | Deselect an allergy | Button returns to unselected state | |
| OB-4.5 | Select diet: Vegetarian | Vegetarian option highlighted | |
| OB-4.6 | Select diet: Vegan | Changes to Vegan (single select) | |
| OB-4.7 | Add excluded food | Food added to list | |
| OB-4.8 | Click "Next" | Proceeds to Step 5 | |

### 2.5 Step 5 - Preferences
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| OB-5.1 | See Step 5 screen | Shows cooking and meal preferences | |
| OB-5.2 | Toggle "Cook Everything" ON | Switch turns on | |
| OB-5.3 | Toggle "Repeat Meals" ON | Switch turns on | |
| OB-5.4 | Select meals per day: 2 | 2 selected | |
| OB-5.5 | Select meals per day: 5 | 5 selected | |
| OB-5.6 | Select cardio preference | Option highlighted | |
| OB-5.7 | Select BORING level | Level selected | |
| OB-5.8 | Select fast food preference | Preference saved | |
| OB-5.9 | Click "Next" | Proceeds to Step 6 (Summary) | |

### 2.6 Step 6 - Summary & Completion
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| OB-6.1 | See Step 6 screen | All entered data displayed | |
| OB-6.2 | Verify goal shown | Matches Step 1 selection | |
| OB-6.3 | Verify stats shown | Matches Step 2 entries | |
| OB-6.4 | Verify activity shown | Matches Step 3 entries | |
| OB-6.5 | Verify diet shown | Matches Step 4 selections | |
| OB-6.6 | Verify preferences shown | Matches Step 5 selections | |
| OB-6.7 | Click "Edit" on any section | Can go back and edit | |
| OB-6.8 | Click "Start My Plan" | Redirects to `/dashboard` | |
| OB-6.9 | Refresh page | Should stay on dashboard (onboarding complete) | |

---

## 3. DASHBOARD TESTING

### 3.1 Macro Progress Cards
**Path:** `/dashboard`

| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| DB-1.1 | View calories card | Shows consumed/target with flame icon | |
| DB-1.2 | View protein card | Shows consumed/target (g) with beef icon | |
| DB-1.3 | View carbs card | Shows consumed/target (g) with wheat icon | |
| DB-1.4 | View fat card | Shows consumed/target (g) with droplet icon | |
| DB-1.5 | Verify progress bars | Fill based on consumption percentage | |
| DB-1.6 | Verify color coding | Calories=orange, Protein=blue, Carbs=amber, Fat=rose | |

### 3.2 Meal Display & Interaction
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| DB-2.1 | View meals section | Shows 3 meals (Meal 1, 2, 3) | |
| DB-2.2 | See meal info | Name, time slot, calories, protein displayed | |
| DB-2.3 | Click meal checkbox | Checkbox fills with checkmark | |
| DB-2.4 | Verify macro recalculation | Dashboard macros update immediately | |
| DB-2.5 | Verify meal styling | Completed meal has opacity + strikethrough | |
| DB-2.6 | Toggle meal checkbox off | Meal returns to normal, macros recalculate | |
| DB-2.7 | Click meal header (not checkbox) | Meal expands showing details | |
| DB-2.8 | View expanded ingredients | All ingredients listed with amounts | |
| DB-2.9 | View macro per ingredient | Shows p/c/f for each ingredient | |
| DB-2.10 | View preparation instructions | Full cooking instructions displayed | |
| DB-2.11 | Click "Swap Meal" button | Opens recipe selection or navigates to /recipes | |
| DB-2.12 | Click "Edit" button | Opens meal edit functionality | |
| DB-2.13 | Click meal header again | Meal collapses | |
| DB-2.14 | Chevron icon animation | Rotates on expand/collapse | |

### 3.3 Training & Activity Section
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| DB-3.1 | View Training card | Shows workout type, exercise count | |
| DB-3.2 | Training badge shows "Pending" | Badge is neutral color | |
| DB-3.3 | Click "Start Workout" | Button changes or opens workout | |
| DB-3.4 | Toggle training complete | Badge changes to "Done", primary color | |
| DB-3.5 | Button label changes | Shows "Mark Incomplete" when done | |
| DB-3.6 | View Cardio card | Shows cardio type and duration | |
| DB-3.7 | Toggle cardio complete | Badge and button state change | |
| DB-3.8 | View Steps card | Shows current steps vs goal | |
| DB-3.9 | Progress bar fills correctly | Based on current/goal ratio | |
| DB-3.10 | Percentage displays correctly | Shows 0-100% in corner | |

### 3.4 Header & Navigation
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| DB-4.1 | View date in header | Shows formatted current date | |
| DB-4.2 | Click color mode button | Toggles between light/dark | |
| DB-4.3 | Dark mode applies | Entire UI switches to dark theme | |
| DB-4.4 | View BORING mode indicator | Shows lock icon and message | |

---

## 4. MEALS PAGE TESTING

### 4.1 Rotation Type Toggle
**Path:** `/meals`

| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| ML-1.1 | View rotation toggle | Shows "Same Daily" and "A/B Rotation" | |
| ML-1.2 | Click "Same Daily" | Button highlighted, description updates | |
| ML-1.3 | Click "A/B Rotation" | Button highlighted, description updates | |
| ML-1.4 | View description text | Explains current rotation mode | |

### 4.2 Week View
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| ML-2.1 | View 7 day buttons | Mon-Sun displayed in grid | |
| ML-2.2 | Today's date highlighted | Has special border styling | |
| ML-2.3 | Click different day | Day selected, meals update | |
| ML-2.4 | View A/B badges | Shows on alternating days in A/B mode | |
| ML-2.5 | Day button shows date number | Correct date displayed | |

### 4.3 Meal Details for Selected Day
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| ML-3.1 | View meals for selected day | All 3 meals displayed | |
| ML-3.2 | Expand meal | Shows ingredients and instructions | |
| ML-3.3 | View daily macro summary | Total calories and protein shown | |
| ML-3.4 | Click "Swap Meal" | Opens recipe selection | |
| ML-3.5 | Click "Edit" | Opens edit modal | |

### 4.4 Meal Prep Guide
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| ML-4.1 | View prep guide section | Shows container count | |
| ML-4.2 | Container count updates | Changes based on rotation type | |
| ML-4.3 | Shows prep timing | Rice/veggie prep instructions | |

### 4.5 Shopping List Slideover
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| ML-5.1 | Click "Shopping List" button | Slideover opens from right | |
| ML-5.2 | View ingredient categories | Grouped by category with icons | |
| ML-5.3 | Checkbox toggles purchased | Item gets opacity + strikethrough | |
| ML-5.4 | Progress bar updates | Shows purchase progress | |
| ML-5.5 | Click "Copy to Clipboard" | List copied, toast confirms | |
| ML-5.6 | Click "Reset All" | All checkboxes cleared | |
| ML-5.7 | Close slideover | X button or outside click works | |

---

## 5. RECIPES PAGE TESTING

### 5.1 Search & Filters
**Path:** `/recipes`

| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| RC-1.1 | Type in search box | Results filter in real-time | |
| RC-1.2 | Search is case-insensitive | "chicken" = "Chicken" | |
| RC-1.3 | Clear search | All recipes return | |
| RC-1.4 | Select goal filter | Only matching goal recipes show | |
| RC-1.5 | Select protein source | Filters by protein type | |
| RC-1.6 | Select source (Homemade) | Only homemade recipes show | |
| RC-1.7 | Select source (Fast Food) | Only fast food recipes show | |
| RC-1.8 | Click tag button | Tag filter toggles on | |
| RC-1.9 | Select multiple tags | AND logic applied | |
| RC-1.10 | View results count | Updates with each filter | |
| RC-1.11 | Click "Clear filters" | All filters reset | |

### 5.2 Recipe Grid Display
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| RC-2.1 | View recipe cards | 3-column grid layout | |
| RC-2.2 | Card shows recipe name | Name displayed prominently | |
| RC-2.3 | Card shows prep time | With clock icon | |
| RC-2.4 | Card shows description | 2-line truncated | |
| RC-2.5 | Card shows calories + protein | Macro summary visible | |
| RC-2.6 | Card shows ingredient count | Badge with count | |
| RC-2.7 | Card shows goal tags | Cut/Maintain/Gain badges | |
| RC-2.8 | Card shows source badge | If not homemade | |
| RC-2.9 | Click card | Opens recipe detail modal | |

### 5.3 Empty State
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| RC-3.1 | Apply impossible filter combo | Empty state shown | |
| RC-3.2 | Shows search icon | Icon displayed | |
| RC-3.3 | Shows "No recipes found" | Message displayed | |
| RC-3.4 | Suggests adjusting filters | Help text shown | |

### 5.4 Recipe Detail Modal
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| RC-4.1 | Modal opens on card click | Modal appears with animation | |
| RC-4.2 | Header shows recipe name | Name at top | |
| RC-4.3 | Shows difficulty badge | Easy/Medium/Hard with color | |
| RC-4.4 | Shows prep time | With icon | |
| RC-4.5 | Shows cook time if available | With icon | |
| RC-4.6 | Close button (X) works | Modal closes | |
| RC-4.7 | Macro grid displays | Calories, protein, carbs, fat | |
| RC-4.8 | Color coding correct | Blue=protein, amber=carbs, rose=fat | |
| RC-4.9 | Ingredients list shows | All ingredients with amounts | |
| RC-4.10 | Per-ingredient macros shown | p/c/f for each | |
| RC-4.11 | Instructions numbered | Step-by-step list | |
| RC-4.12 | Pro tips shown if available | With lightbulb icon | |
| RC-4.13 | Tags displayed | As badges at bottom | |
| RC-4.14 | "Close" button works | Modal closes | |
| RC-4.15 | "Add to Meal Plan" opens flow | Opens add to meal plan modal | |

### 5.5 Add to Meal Plan Modal
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| RC-5.1 | Modal shows recipe preview | Name and macros displayed | |
| RC-5.2 | Day dropdown works | All 7 days available | |
| RC-5.3 | Meal slot buttons (3) | Meal 1, 2, 3 options | |
| RC-5.4 | Selected slot highlighted | Primary color border | |
| RC-5.5 | Shows current meal if exists | "Replaces: [meal name]" | |
| RC-5.6 | Shows "Empty" if no meal | When slot is empty | |
| RC-5.7 | "Cancel" closes modal | No changes made | |
| RC-5.8 | "Confirm" adds recipe | Recipe added to meal plan | |
| RC-5.9 | Toast confirms action | Shows day and slot added to | |

---

## 6. EXERCISES PAGE TESTING

### 6.1 Muscle Group Filter
**Path:** `/exercises`

| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| EX-1.1 | View 10 muscle buttons | Chest, Back, Shoulders, Biceps, Triceps, Quads, Hamstrings, Glutes, Calves, Core | |
| EX-1.2 | Click muscle button | Button highlighted, results filter | |
| EX-1.3 | Icons display correctly | Each muscle has icon | |
| EX-1.4 | Click same button again | Deselects filter | |

### 6.2 Additional Filters
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| EX-2.1 | Sort by dropdown | Effectiveness, Difficulty, Name options | |
| EX-2.2 | Change sort order | Results reorder | |
| EX-2.3 | Equipment filter dropdown | Barbell, Dumbbell, Cable, Machine, Bodyweight, Bands | |
| EX-2.4 | Difficulty filter dropdown | Beginner, Intermediate, Advanced | |
| EX-2.5 | Joint friendly toggle | All, Yes, No options | |
| EX-2.6 | "Clear filters" appears | When any filter active | |
| EX-2.7 | "Clear filters" resets all | Returns to unfiltered state | |

### 6.3 Exercise List Display
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| EX-3.1 | Exercise cards display | List format with details | |
| EX-3.2 | Shows exercise name | With effectiveness stars | |
| EX-3.3 | Shows primary muscle badge | Colored badge | |
| EX-3.4 | Shows secondary muscles | Smaller badges | |
| EX-3.5 | Shows joint-friendly badge | Green badge if applicable | |
| EX-3.6 | Shows difficulty badge | Color-coded | |
| EX-3.7 | Shows equipment icon | Correct equipment type | |
| EX-3.8 | Shows effectiveness rating | X/5 format | |
| EX-3.9 | Click opens detail modal | Modal appears | |

### 6.4 Exercise Detail Modal
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| EX-4.1 | Header shows exercise name | Name displayed | |
| EX-4.2 | Shows equipment and difficulty | In subtitle | |
| EX-4.3 | Close button (X) works | Modal closes | |
| EX-4.4 | Star rating displays | Filled and unfilled stars | |
| EX-4.5 | "Watch Form Video" button | Orange outline button | |
| EX-4.6 | Click video button | Opens video modal | |
| EX-4.7 | Target muscles section | Primary (solid) and secondary (subtle) badges | |
| EX-4.8 | Instructions section | Full form instructions | |
| EX-4.9 | Tips section | Exercise tips | |
| EX-4.10 | **Rep Range Benchmarks** | Shows Beginner, Intermediate, Advanced | |
| EX-4.11 | Benchmark format | sets × reps @ weight | |
| EX-4.12 | Benchmark colors | Match difficulty levels | |
| EX-4.13 | Tags section | Joint friendly, difficulty, equipment | |
| EX-4.14 | "Close" button works | Modal closes | |
| EX-4.15 | "Add to Workout" button | Opens workout day selection | |

### 6.5 Video Modal
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| EX-5.1 | Modal opens | Video modal appears | |
| EX-5.2 | Title shows | "Exercise Form Video" | |
| EX-5.3 | Description shows | "Watch this video..." | |
| EX-5.4 | YouTube iframe loads | Video player embedded | |
| EX-5.5 | Video plays | Can play embedded video | |
| EX-5.6 | Aspect ratio correct | 16:9 | |
| EX-5.7 | "Close" button works | Modal closes | |
| EX-5.8 | "Open in YouTube" | Opens new tab to YouTube | |

### 6.6 Add to Workout Modal
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| EX-6.1 | Modal shows exercise name | Name in description | |
| EX-6.2 | All workout days listed | From current plan | |
| EX-6.3 | Click day to select | Border highlights, checkmark appears | |
| EX-6.4 | Shows day focus | e.g., "Chest/Shoulders/Triceps" | |
| EX-6.5 | Shows exercise count | "X exercises" per day | |
| EX-6.6 | "Cancel" closes modal | No changes | |
| EX-6.7 | "Add Exercise" disabled | Until day selected | |
| EX-6.8 | "Add Exercise" adds | Exercise added to day | |
| EX-6.9 | Toast confirms action | Shows exercise and day name | |

---

## 7. WORKOUTS PAGE TESTING

### 7.1 Current Plan Header
**Path:** `/workouts`

| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| WK-1.1 | View plan name | e.g., "Push/Pull/Legs" | |
| WK-1.2 | View plan type and days | e.g., "PPL • 6 days/week" | |
| WK-1.3 | View current week | "Week X" | |
| WK-1.4 | BORING Mode toggle | Switch to toggle mode | |
| WK-1.5 | Toggle mode on/off | Label updates | |

### 7.2 Day Tabs
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| WK-2.1 | View all day tabs | All plan days shown | |
| WK-2.2 | Selected day highlighted | Primary color | |
| WK-2.3 | Click different day | Tab switches, content updates | |
| WK-2.4 | Horizontal scroll | If many days, can scroll | |

### 7.3 Selected Day Detail
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| WK-3.1 | Day header shows | Name and focus | |
| WK-3.2 | Exercise count shown | e.g., "5 exercises" | |
| WK-3.3 | Total sets shown | Sum of all exercise sets | |
| WK-3.4 | "Start Workout" button | Primary button visible | |
| WK-3.5 | Exercise list displays | All exercises for day | |
| WK-3.6 | Exercise shows name | Exercise name | |
| WK-3.7 | Shows sets × reps @ weight | Format correct | |
| WK-3.8 | Chevron for expand | Arrow icon | |
| WK-3.9 | Edit pencil icon | Opens edit modal | |
| WK-3.10 | Expand exercise | Shows instructions/video | |
| WK-3.11 | Video link clickable | Opens YouTube if available | |
| WK-3.12 | "Add Exercise" button | At bottom of list | |
| WK-3.13 | "Add Exercise" navigates | Goes to /exercises | |

### 7.4 Quick Stats Cards
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| WK-4.1 | Weeks on plan card | Shows week number | |
| WK-4.2 | Workouts this week card | Shows count | |
| WK-4.3 | Weekly sets card | Shows total sets | |
| WK-4.4 | Icons display | Calendar, dumbbell, layers | |

### 7.5 Create New Plan Modal
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| WK-5.1 | Click "New Plan" | Modal opens | |
| WK-5.2 | See 4 split types | PPL, Upper/Lower, Full Body, Bro Split | |
| WK-5.3 | Each shows days/week | 6, 4, 3, 5 respectively | |
| WK-5.4 | Click to select type | Border highlights | |
| WK-5.5 | Shows description | Explains split type | |
| WK-5.6 | "Cancel" closes | No changes | |
| WK-5.7 | "Create Plan" disabled | Until selection made | |
| WK-5.8 | **"Create Plan" works** | Creates new plan with exercises | |
| WK-5.9 | Toast confirms | Shows plan type created | |
| WK-5.10 | Plan displays | New plan visible with days | |
| WK-5.11 | Exercises auto-populated | From exercise database | |

### 7.6 Active Workout Modal
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| WK-6.1 | Click "Start Workout" | Modal opens | |
| WK-6.2 | Header shows day info | Name and focus | |
| WK-6.3 | All exercises listed | Scrollable list | |
| WK-6.4 | Progress shown | "X of Y sets completed" | |
| WK-6.5 | **Set tracking per exercise:** | | |
| WK-6.6 | - Set number label | "Set 1", "Set 2", etc. | |
| WK-6.7 | - Reps input field | Number input | |
| WK-6.8 | - Weight input field | Number input with "lbs" | |
| WK-6.9 | - "Complete" button | Click to mark set done | |
| WK-6.10 | Completing set | Styling changes, inputs disable | |
| WK-6.11 | Checkmark replaces button | When set complete | |
| WK-6.12 | Progress updates | As sets completed | |
| WK-6.13 | "Cancel Workout" | Closes without saving | |
| WK-6.14 | **"Finish Workout"** | Saves workout to history | |
| WK-6.15 | Toast shows completion | "Great work! X of Y sets" | |

### 7.7 Edit Exercise Modal
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| WK-7.1 | Click edit pencil | Modal opens | |
| WK-7.2 | Shows exercise name | In header | |
| WK-7.3 | Sets input (1-10) | Number input with limits | |
| WK-7.4 | Reps input | Text input (e.g., "8-10") | |
| WK-7.5 | Target weight input | Number input | |
| WK-7.6 | Video URL input | Optional text input | |
| WK-7.7 | Instructions textarea | 3 rows | |
| WK-7.8 | "Cancel" closes | No changes | |
| WK-7.9 | "Save Changes" saves | Updates exercise | |
| WK-7.10 | Changes persist | Visible after modal close | |

---

## 8. PROGRESS PAGE TESTING

### 8.1 Summary Cards
**Path:** `/progress`

| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| PR-1.1 | View 5 summary cards | Horizontal layout | |
| PR-1.2 | Current Weight card | Shows weight in lbs | |
| PR-1.3 | Weekly change indicator | Green text with +/- | |
| PR-1.4 | Total Lost card | Total weight lost | |
| PR-1.5 | Date range shown | Start to current date | |
| PR-1.6 | Body Fat % card | Current body fat | |
| PR-1.7 | BF change since start | Shows delta | |
| PR-1.8 | Goal Weight card | Target weight | |
| PR-1.9 | Remaining weight shown | How much left to go | |
| PR-1.10 | Progress % card | 0-100% progress | |
| PR-1.11 | Progress bar visualization | Fills proportionally | |

### 8.2 Tab Navigation
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| PR-2.1 | View 4 tabs | Overview, Weight, Photos, Measurements | |
| PR-2.2 | Default tab active | Overview highlighted | |
| PR-2.3 | Click "Weight" | Weight tab content shows | |
| PR-2.4 | Click "Photos" | Photos tab content shows | |
| PR-2.5 | Click "Measurements" | Measurements tab shows | |
| PR-2.6 | Tab styling updates | Bottom border on active | |

### 8.3 Overview Tab
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| PR-3.1 | Last Check-in card | Shows latest entry | |
| PR-3.2 | Date displayed | Formatted date | |
| PR-3.3 | Grid shows values | Weight, Waist, Chest, Arms, Thighs | |
| PR-3.4 | Body Fat % shown | If available | |
| PR-3.5 | Notes displayed | If added | |
| PR-3.6 | **Check-in History card** | List of all entries | |
| PR-3.7 | Newest first | Reverse chronological | |
| PR-3.8 | Each entry shows date | Formatted | |
| PR-3.9 | **Edit button (pencil)** | On each entry | |
| PR-3.10 | **Delete button (trash)** | On each entry | |
| PR-3.11 | Entry grid shows values | Weight and measurements | |
| PR-3.12 | Hover effects work | Visual feedback | |

### 8.4 Weight Tab
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| PR-4.1 | Weight chart displays | Bar chart visualization | |
| PR-4.2 | Bars sized by weight | Proportional heights | |
| PR-4.3 | Dates below bars | X-axis labels | |
| PR-4.4 | Goal line shown | Horizontal reference | |
| PR-4.5 | Start weight line shown | Horizontal reference | |
| PR-4.6 | Legend displays | Goal vs Start explained | |
| PR-4.7 | Weekly Change card | Large weekly average | |
| PR-4.8 | Avg lbs/week shown | Calculated value | |
| PR-4.9 | Estimated weeks to goal | Calculated projection | |
| PR-4.10 | Green color for progress | Positive indicator | |

### 8.5 Photos Tab
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| PR-5.1 | Photos grid (3 columns) | Aspect ratio 3:4 | |
| PR-5.2 | Photos display | If any uploaded | |
| PR-5.3 | Date overlay | On each photo | |
| PR-5.4 | Type label | Front/Side/Back | |
| PR-5.5 | Empty state | Placeholder with icon | |
| PR-5.6 | "Add Progress Photo" button | Click to upload | |
| PR-5.7 | Click button | Opens file picker | |
| PR-5.8 | Select valid image | Upload starts | |
| PR-5.9 | Loading state shown | While uploading | |
| PR-5.10 | Toast on success | Confirms upload | |
| PR-5.11 | Photo appears in grid | After upload | |

### 8.6 Measurements Tab
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| PR-6.1 | 4 measurement cards | Waist, Chest, Arms, Thighs | |
| PR-6.2 | Current value shown | In inches | |
| PR-6.3 | Change badge | Green if decreased | |
| PR-6.4 | Last 3 measurements | Listed with dates | |
| PR-6.5 | Green badges for improvements | Visual progress | |
| PR-6.6 | **Body Fat % card** | Current percentage | |
| PR-6.7 | BF change badge | Green if decreased | |
| PR-6.8 | Last 3 BF readings | With dates | |

### 8.7 New Check-in Modal
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| PR-7.1 | Click "New Check-in" | Modal opens | |
| PR-7.2 | Header shows | "New Check-in" title | |
| PR-7.3 | Current date displayed | In subheader | |
| PR-7.4 | Close button (X) | Works | |
| PR-7.5 | Weight input (lbs) | Step 0.1 | |
| PR-7.6 | Waist input (in) | Step 0.25 | |
| PR-7.7 | Chest input (in) | Step 0.25 | |
| PR-7.8 | Arms input (in) | Step 0.25 | |
| PR-7.9 | Thighs input (in) | Step 0.25 | |
| PR-7.10 | **Body Fat % input** | Optional | |
| PR-7.11 | Notes textarea | Optional | |
| PR-7.12 | 2-column grid layout | Measurements side by side | |
| PR-7.13 | "Cancel" closes | No save | |
| PR-7.14 | "Save Check-in" saves | Toast confirms | |
| PR-7.15 | Data appears in overview | New entry visible | |

### 8.8 Edit Check-in Modal
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| PR-8.1 | Click edit pencil | Modal opens | |
| PR-8.2 | Title shows "Edit Check-in" | Or similar | |
| PR-8.3 | Fields pre-populated | With existing values | |
| PR-8.4 | Can modify values | All editable | |
| PR-8.5 | "Cancel" closes | No changes | |
| PR-8.6 | "Save" updates entry | Toast confirms | |
| PR-8.7 | Changes reflected | In history list | |

### 8.9 Delete Check-in Modal
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| PR-9.1 | Click delete (trash) | Modal opens | |
| PR-9.2 | Title "Delete Check-in" | Shown | |
| PR-9.3 | Warning message | "Cannot be undone" | |
| PR-9.4 | Shows date being deleted | For confirmation | |
| PR-9.5 | Explains what's deleted | Weight + measurements | |
| PR-9.6 | "Cancel" closes | No deletion | |
| PR-9.7 | "Delete" (red button) | Deletes entry | |
| PR-9.8 | Toast confirms deletion | | |
| PR-9.9 | Entry removed from list | | |

---

## 9. SETTINGS PAGE TESTING

### 9.1 Settings Navigation
**Path:** `/settings`

| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| ST-1.1 | View settings layout | Sidebar navigation | |
| ST-1.2 | Profile tab | Selected by default | |
| ST-1.3 | Macros tab clickable | Navigates to macros | |
| ST-1.4 | Preferences tab clickable | Navigates to preferences | |
| ST-1.5 | Account tab clickable | Navigates to account | |
| ST-1.6 | Icons display | For each section | |

### 9.2 Profile Settings
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| ST-2.1 | Profile info displays | Basic profile shown | |

### 9.3 Macros Settings
**Path:** `/settings/macros`

| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| ST-3.1 | Goal selection (3 buttons) | Cut, Maintain, Gain | |
| ST-3.2 | Click to select goal | Highlight changes | |
| ST-3.3 | Aggression toggle | Safe vs Aggressive | |
| ST-3.4 | Description updates | Based on selection | |
| ST-3.5 | Calculated targets grid | Calories, Protein, Carbs, Fat | |
| ST-3.6 | Values update on changes | Recalculates | |
| ST-3.7 | Fiber/Water shown | Below main macros | |
| ST-3.8 | Custom macros toggle | Switch to enable | |
| ST-3.9 | Enable shows inputs | 4 input fields | |
| ST-3.10 | Custom values editable | Enter numbers | |
| ST-3.11 | Custom overrides calculated | Custom values used | |
| ST-3.12 | "Save Changes" button | Top right | |
| ST-3.13 | Save shows toast | Confirms save | |

### 9.4 Preferences Settings
**Path:** `/settings/preferences`

| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| ST-4.1 | BORING Mode toggle | Switch | |
| ST-4.2 | Toggle changes mode | Persists | |
| ST-4.3 | Meals per day buttons | 2, 3, 4, 5 options | |
| ST-4.4 | Click to select | Highlight changes | |
| ST-4.5 | Allergies section | 6 buttons | |
| ST-4.6 | Multi-select works | Multiple can be on | |
| ST-4.7 | Red/error color | For selected allergies | |
| ST-4.8 | Restrictions section | 5 buttons | |
| ST-4.9 | Dark Mode toggle | App settings | |
| ST-4.10 | Meal Reminders toggle | | |
| ST-4.11 | Weekly Check-in toggle | | |
| ST-4.12 | "Save Changes" | Toast confirms | |

### 9.5 Account Settings
**Path:** `/settings/account`

| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| ST-5.1 | Change Password button | Opens modal | |
| ST-5.2 | Password modal fields | Current, New, Confirm | |
| ST-5.3 | Fields are masked | Type password hidden | |
| ST-5.4 | Validation: mismatch | Shows error | |
| ST-5.5 | "Cancel" closes modal | | |
| ST-5.6 | "Change" with valid data | Toast confirms (mock) | |
| ST-5.7 | Export Data button | | |
| ST-5.8 | Export shows toast | "Export started" | |
| ST-5.9 | Sign Out button | | |
| ST-5.10 | Sign Out redirects | To /onboarding | |
| ST-5.11 | **Danger Zone** | Red styling | |
| ST-5.12 | Delete Account button | Red variant | |
| ST-5.13 | Delete opens confirmation | Modal with warning | |
| ST-5.14 | Warning lists deletions | What will be removed | |
| ST-5.15 | "Cancel" closes modal | | |
| ST-5.16 | "Delete" (red) | Deletes and redirects | |

---

## 10. PHOTO UPLOAD TESTING

### 10.1 Upload API Validation
**Endpoint:** `POST /api/upload`

| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| UP-1.1 | Upload valid JPG < 5MB | Success, URL returned | |
| UP-1.2 | Upload valid PNG < 5MB | Success, URL returned | |
| UP-1.3 | Upload valid WebP < 5MB | Success, URL returned | |
| UP-1.4 | Upload file > 5MB | Error: File too large | |
| UP-1.5 | Upload PDF file | Error: Invalid file type | |
| UP-1.6 | Upload without file | Error: No file provided | |

### 10.2 Storage Fallback
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| UP-2.1 | With Bunny CDN configured | Uploads to CDN | |
| UP-2.2 | Without CDN (local mode) | Saves to /uploads folder | |
| UP-2.3 | Local file accessible | Can load via /uploads/... URL | |

### 10.3 UI Upload Flow
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| UP-3.1 | Click upload button | File picker opens | |
| UP-3.2 | Select valid image | Upload initiates | |
| UP-3.3 | Loading indicator | Shown during upload | |
| UP-3.4 | Success toast | After completion | |
| UP-3.5 | Image appears in grid | Photo visible | |
| UP-3.6 | Error toast on failure | Shows error message | |

---

## 11. UI/UX STANDARDS VERIFICATION

### 11.1 Modal Standards (CLAUDE.md Compliance)
| Test Case | Element to Check | Expected | Pass/Fail |
|-----------|-----------------|----------|-----------|
| UI-1.1 | All modals have close button (X) | Top-right X button | |
| UI-1.2 | Modal padding | p-6 minimum | |
| UI-1.3 | Content spacing | space-y-6 or space-y-4 | |
| UI-1.4 | Form inputs full width | class="w-full" | |
| UI-1.5 | Footer has Cancel + Primary | Left/right button layout | |
| UI-1.6 | Cancel is ghost variant | variant="ghost" | |
| UI-1.7 | Primary action on right | Save/Confirm/etc. | |

### 11.2 Dashboard Padding
| Test Case | Page | Expected | Pass/Fail |
|-----------|------|----------|-----------|
| UI-2.1 | Dashboard | px-4 sm:px-6 lg:px-8 | |
| UI-2.2 | Meals | px-4 sm:px-6 lg:px-8 | |
| UI-2.3 | Recipes | px-4 sm:px-6 lg:px-8 | |
| UI-2.4 | Exercises | px-4 sm:px-6 lg:px-8 | |
| UI-2.5 | Workouts | px-4 sm:px-6 lg:px-8 | |
| UI-2.6 | Progress | px-4 sm:px-6 lg:px-8 | |
| UI-2.7 | Settings | px-4 sm:px-6 lg:px-8 | |

### 11.3 Color Scheme
| Test Case | Element | Expected Color | Pass/Fail |
|-----------|---------|----------------|-----------|
| UI-3.1 | Primary buttons | Emerald | |
| UI-3.2 | Neutral elements | Stone | |
| UI-3.3 | Protein indicators | Blue | |
| UI-3.4 | Carbs indicators | Amber | |
| UI-3.5 | Fat indicators | Rose | |
| UI-3.6 | Calorie indicators | Orange | |
| UI-3.7 | Success elements | Green | |
| UI-3.8 | Error/danger elements | Red | |

### 11.4 Typography Hierarchy
| Test Case | Element | Expected Style | Pass/Fail |
|-----------|---------|----------------|-----------|
| UI-4.1 | Page titles | text-2xl font-semibold | |
| UI-4.2 | Section headers | text-lg font-semibold | |
| UI-4.3 | Card headers | font-medium | |
| UI-4.4 | Caption/helper text | text-sm text-muted | |

---

## 12. RESPONSIVE DESIGN TESTING

### 12.1 Mobile (< 640px)
| Test Case | Element | Expected | Pass/Fail |
|-----------|---------|----------|-----------|
| RS-1.1 | Sidebar collapses | Hidden or hamburger | |
| RS-1.2 | Macro cards stack | Single column | |
| RS-1.3 | Recipe grid | 1 column | |
| RS-1.4 | Exercise list | Full width | |
| RS-1.5 | Modals | Full width | |
| RS-1.6 | Touch targets | Min 44x44px | |
| RS-1.7 | Text readable | No overflow | |
| RS-1.8 | Horizontal padding | 16px (px-4) | |

### 12.2 Tablet (640px - 1024px)
| Test Case | Element | Expected | Pass/Fail |
|-----------|---------|----------|-----------|
| RS-2.1 | Macro cards | 2 columns | |
| RS-2.2 | Recipe grid | 2 columns | |
| RS-2.3 | Sidebar | May be visible | |
| RS-2.4 | Modals | Proper max-width | |
| RS-2.5 | Horizontal padding | 24px (sm:px-6) | |

### 12.3 Desktop (> 1024px)
| Test Case | Element | Expected | Pass/Fail |
|-----------|---------|----------|-----------|
| RS-3.1 | Macro cards | 4 columns | |
| RS-3.2 | Recipe grid | 3 columns | |
| RS-3.3 | Sidebar | Always visible | |
| RS-3.4 | Content max-width | Contained | |
| RS-3.5 | Horizontal padding | 32px (lg:px-8) | |

---

## 13. DATA PERSISTENCE TESTING

### 13.1 localStorage Persistence
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| DP-1.1 | Add meal to plan | Data saved to localStorage | |
| DP-1.2 | Refresh page | Meal plan preserved | |
| DP-1.3 | Start workout | Session data saved | |
| DP-1.4 | Close browser | Data persists on return | |
| DP-1.5 | Log weight entry | Appears in history | |
| DP-1.6 | Edit workout | Changes persist | |
| DP-1.7 | Clear site data | All data cleared | |
| DP-1.8 | Onboarding state | Not shown after completion | |

### 13.2 Cross-Tab Sync (if implemented)
| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| DP-2.1 | Open two tabs | Both show same data | |
| DP-2.2 | Change in tab 1 | Tab 2 updates | |

---

## 14. PERFORMANCE TESTING

### 14.1 Load Times
| Test Case | Threshold | Actual | Pass/Fail |
|-----------|-----------|--------|-----------|
| PF-1.1 | Initial page load | < 3 seconds | |
| PF-1.2 | Page navigation | < 1 second | |
| PF-1.3 | Modal open | < 200ms | |
| PF-1.4 | Recipe filtering | Instant | |
| PF-1.5 | Macro calculation | Instant | |

### 14.2 Bundle Size
| Test Case | Check | Expected | Pass/Fail |
|-----------|-------|----------|-----------|
| PF-2.1 | JS bundle | < 500KB gzipped | |
| PF-2.2 | No console errors | Clean console | |
| PF-2.3 | No layout shifts | CLS < 0.1 | |

### 14.3 Network Throttling
| Test Case | Condition | Expected | Pass/Fail |
|-----------|-----------|----------|-----------|
| PF-3.1 | Slow 3G | App still usable | |
| PF-3.2 | Offline mode | Shows cached data | |

---

## 15. ACCESSIBILITY TESTING

### 15.1 Keyboard Navigation
| Test Case | Action | Expected | Pass/Fail |
|-----------|--------|----------|-----------|
| A11Y-1.1 | Tab through page | Logical order | |
| A11Y-1.2 | Tab into modal | Focus trapped | |
| A11Y-1.3 | Escape closes modal | Modal closes | |
| A11Y-1.4 | Enter on buttons | Activates button | |
| A11Y-1.5 | Arrow keys in dropdowns | Navigation works | |

### 15.2 Screen Reader
| Test Case | Element | Expected | Pass/Fail |
|-----------|---------|----------|-----------|
| A11Y-2.1 | Form labels | Announced | |
| A11Y-2.2 | Button text | Read aloud | |
| A11Y-2.3 | Icons | Have aria-labels | |
| A11Y-2.4 | Progress bars | Value announced | |

### 15.3 Visual
| Test Case | Element | Expected | Pass/Fail |
|-----------|---------|----------|-----------|
| A11Y-3.1 | Color contrast | WCAG AA (4.5:1) | |
| A11Y-3.2 | Focus indicators | Visible outline | |
| A11Y-3.3 | Text zoom 200% | Readable, no overflow | |

---

## 16. BROWSER COMPATIBILITY

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | | |
| Chrome | Latest - 1 | | |
| Firefox | Latest | | |
| Firefox | Latest - 1 | | |
| Safari | Latest | | |
| Safari | Latest - 1 | | |
| Edge | Latest | | |
| iOS Safari | 15+ | | |
| Chrome Mobile | Latest | | |

---

## 17. EDGE CASES & ERROR HANDLING

### 17.1 Empty States
| Test Case | Scenario | Expected | Pass/Fail |
|-----------|----------|----------|-----------|
| EC-1.1 | No recipes match filter | Empty state message | |
| EC-1.2 | No exercises match filter | Empty state message | |
| EC-1.3 | No weight history | Empty chart message | |
| EC-1.4 | No progress photos | Placeholder icon | |
| EC-1.5 | Empty meal slot | Shows "Empty" | |
| EC-1.6 | Empty workout day | Shows "No exercises" | |

### 17.2 Invalid Data
| Test Case | Scenario | Expected | Pass/Fail |
|-----------|----------|----------|-----------|
| EC-2.1 | Negative weight | Validation error | |
| EC-2.2 | Age > 120 | Validation error | |
| EC-2.3 | Empty required field | Submit blocked | |
| EC-2.4 | Very long text input | Truncated or limited | |
| EC-2.5 | Special characters | Handled gracefully | |

### 17.3 Network Errors
| Test Case | Scenario | Expected | Pass/Fail |
|-----------|----------|----------|-----------|
| EC-3.1 | Photo upload timeout | Error toast | |
| EC-3.2 | Photo upload failure | Error message | |
| EC-3.3 | CDN unavailable | Local fallback works | |

### 17.4 Rapid Actions
| Test Case | Scenario | Expected | Pass/Fail |
|-----------|----------|----------|-----------|
| EC-4.1 | Double-click button | Single action only | |
| EC-4.2 | Rapid tab switching | No errors | |
| EC-4.3 | Quick modal open/close | No stuck state | |

---

## 18. SIGN-OFF CHECKLIST

### Critical Path Tests
- [ ] Onboarding flow completes successfully
- [ ] Dashboard displays and macro tracking works
- [ ] Meal planning with shopping list works
- [ ] Recipe search and add to meal plan works
- [ ] Exercise browsing and add to workout works
- [ ] Workout creation and session tracking works
- [ ] Progress check-ins with edit/delete works
- [ ] Photo upload works (with fallback)
- [ ] Settings save correctly
- [ ] Dark mode toggle works
- [ ] All modals have close buttons and proper padding
- [ ] Mobile responsive design works

### QA Tester Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Developer | | | |
| Product Owner | | | |

---

## APPENDIX A: TEST DATA

### Sample User Profile
```json
{
  "sex": "male",
  "age": 30,
  "height": 178,
  "weight": 180,
  "goal": "cut",
  "aggression": "safe",
  "liftingDays": 4,
  "dailySteps": 10000,
  "allergies": [],
  "dietaryPattern": "none",
  "mealsPerDay": 3,
  "boringLevel": "maximum"
}
```

### Sample Check-in Entry
```json
{
  "date": "2025-12-19",
  "weight": 178.5,
  "waist": 34.5,
  "chest": 42.0,
  "arms": 15.0,
  "thighs": 24.0,
  "bodyFat": 18.5,
  "notes": "Feeling good, energy levels high"
}
```

---

## APPENDIX B: KNOWN LIMITATIONS

1. **No Authentication:** All data is client-side in localStorage
2. **No Stripe:** Payment integration not implemented
3. **No Webhooks:** No backend webhook handling
4. **No Multi-User:** Single user per browser
5. **No Cloud Sync:** Data doesn't sync across devices
6. **Mock Password Change:** Settings password change is simulated
7. **Mock Export:** Data export is simulated

---

## APPENDIX C: ENVIRONMENT VARIABLES

```bash
# Required for full functionality
NUXT_PUBLIC_SITE_URL=https://your-domain.com

# Bunny CDN (optional - falls back to local)
BUNNY_STORAGE_ZONE=your-zone
BUNNY_STORAGE_API_KEY=your-api-key
BUNNY_STORAGE_HOSTNAME=storage.bunnycdn.com
BUNNY_CDN_HOSTNAME=your-cdn.b-cdn.net

# Payload CMS (if using admin)
NUXT_PAYLOAD_API_URL=http://localhost:3000
PAYLOAD_API_KEY=your-payload-key
```

---

**END OF QA TESTING GUIDE**

*Document generated: December 19, 2025*
*Total test cases: 500+*
*Estimated testing time: 8-12 hours*
