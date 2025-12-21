import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_sex" AS ENUM('male', 'female', 'unspecified');
  CREATE TYPE "public"."enum_users_height_unit" AS ENUM('cm', 'in');
  CREATE TYPE "public"."enum_users_current_weight_unit" AS ENUM('kg', 'lbs');
  CREATE TYPE "public"."enum_users_goal" AS ENUM('cut', 'maintain', 'gain');
  CREATE TYPE "public"."enum_users_aggression" AS ENUM('safe', 'aggressive');
  CREATE TYPE "public"."enum_users_dietary_restrictions_dietary_pattern" AS ENUM('none', 'halal', 'kosher', 'vegetarian', 'pescatarian', 'vegan');
  CREATE TYPE "public"."enum_users_preferences_cardio_preference" AS ENUM('incline_walk', 'bike', 'none');
  CREATE TYPE "public"."enum_recipes_goal_tags" AS ENUM('cut', 'maintain', 'gain');
  CREATE TYPE "public"."enum_recipes_ingredients_unit" AS ENUM('g', 'oz', 'cups', 'tbsp', 'tsp', 'each');
  CREATE TYPE "public"."enum_recipes_tags" AS ENUM('meal_prep', 'no_oil', 'air_fryer', 'microwave', 'budget', 'high_protein', 'low_carb', 'batch_cook');
  CREATE TYPE "public"."enum_recipes_protein_source" AS ENUM('chicken', 'turkey', 'beef', 'fish', 'eggs', 'tofu', 'legumes', 'other');
  CREATE TYPE "public"."enum_recipes_carb_source" AS ENUM('rice', 'potatoes', 'oats', 'pasta', 'bread', 'quinoa', 'none');
  CREATE TYPE "public"."enum_ingredients_category" AS ENUM('protein', 'carb', 'vegetable', 'fruit', 'fat', 'dairy', 'seasoning', 'other');
  CREATE TYPE "public"."enum_ingredients_default_unit" AS ENUM('g', 'oz', 'cups', 'tbsp', 'tsp', 'each');
  CREATE TYPE "public"."enum_exercises_secondary_muscles" AS ENUM('chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'abs', 'forearms', 'traps');
  CREATE TYPE "public"."enum_exercises_equipment" AS ENUM('barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'kettlebell', 'band', 'pullup_bar', 'bench', 'ez_bar');
  CREATE TYPE "public"."enum_exercises_best_for" AS ENUM('strength', 'hypertrophy', 'beginner_safe', 'compound', 'isolation');
  CREATE TYPE "public"."enum_exercises_primary_muscle" AS ENUM('chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'abs', 'forearms', 'traps', 'full_body');
  CREATE TYPE "public"."enum_exercises_difficulty" AS ENUM('beginner', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum_meal_plans_day_a_meals_slot" AS ENUM('meal_1', 'meal_2', 'meal_3', 'meal_4', 'meal_5');
  CREATE TYPE "public"."enum_meal_plans_day_b_meals_slot" AS ENUM('meal_1', 'meal_2', 'meal_3', 'meal_4', 'meal_5');
  CREATE TYPE "public"."enum_meal_plans_custom_days_meals_slot" AS ENUM('meal_1', 'meal_2', 'meal_3', 'meal_4', 'meal_5');
  CREATE TYPE "public"."enum_meal_plans_custom_days_day_of_week" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_meal_plans_rotation_type" AS ENUM('same_daily', 'ab_rotation', 'custom');
  CREATE TYPE "public"."enum_workout_plans_workouts_day_of_week" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_workout_plans_split_type" AS ENUM('full_body', 'upper_lower', 'ppl', 'ppl_upper', 'bro_split', 'custom');
  CREATE TYPE "public"."enum_workout_plans_goal" AS ENUM('maintain', 'strength', 'hypertrophy');
  CREATE TYPE "public"."enum_workout_plans_cardio_type" AS ENUM('incline_walk', 'bike', 'stairs', 'rowing', 'none');
  CREATE TYPE "public"."enum_progress_logs_meals_eaten_slot" AS ENUM('meal_1', 'meal_2', 'meal_3', 'meal_4', 'meal_5');
  CREATE TYPE "public"."enum_progress_logs_weight_unit" AS ENUM('kg', 'lbs');
  CREATE TYPE "public"."enum_progress_logs_waist_unit" AS ENUM('cm', 'in');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"sex" "enum_users_sex",
  	"age" numeric,
  	"height_value" numeric,
  	"height_unit" "enum_users_height_unit" DEFAULT 'cm',
  	"current_weight_value" numeric,
  	"current_weight_unit" "enum_users_current_weight_unit" DEFAULT 'kg',
  	"goal" "enum_users_goal" DEFAULT 'maintain' NOT NULL,
  	"lifting_days_per_week" numeric DEFAULT 4,
  	"daily_steps_estimate" numeric DEFAULT 8000,
  	"aggression" "enum_users_aggression" DEFAULT 'safe',
  	"deadline_date" timestamp(3) with time zone,
  	"dietary_restrictions_allergies" varchar,
  	"dietary_restrictions_dietary_pattern" "enum_users_dietary_restrictions_dietary_pattern",
  	"dietary_restrictions_excluded_foods" varchar,
  	"preferences_cook_everything" boolean DEFAULT true,
  	"preferences_repeat_meals" boolean DEFAULT true,
  	"preferences_meals_per_day" numeric DEFAULT 3,
  	"preferences_cardio_preference" "enum_users_preferences_cardio_preference" DEFAULT 'incline_walk',
  	"macro_targets_calories" numeric,
  	"macro_targets_protein" numeric,
  	"macro_targets_carbs" numeric,
  	"macro_targets_fat" numeric,
  	"macro_targets_fiber" numeric,
  	"macro_targets_water" numeric,
  	"boring_mode" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "recipes_goal_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_recipes_goal_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "recipes_ingredients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ingredient_id" integer NOT NULL,
  	"amount" numeric NOT NULL,
  	"unit" "enum_recipes_ingredients_unit" NOT NULL,
  	"raw_weight" numeric
  );
  
  CREATE TABLE "recipes_instructions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" varchar NOT NULL
  );
  
  CREATE TABLE "recipes_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_recipes_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "recipes_substitutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"original_id" integer,
  	"substitute_id" integer,
  	"note" varchar
  );
  
  CREATE TABLE "recipes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"prep_time_minutes" numeric NOT NULL,
  	"servings" numeric DEFAULT 1 NOT NULL,
  	"boring_score" numeric DEFAULT 8 NOT NULL,
  	"macros_per_serving_calories" numeric NOT NULL,
  	"macros_per_serving_protein" numeric NOT NULL,
  	"macros_per_serving_carbs" numeric NOT NULL,
  	"macros_per_serving_fat" numeric NOT NULL,
  	"macros_per_serving_fiber" numeric DEFAULT 0,
  	"macros_per_serving_sodium" numeric DEFAULT 0,
  	"restrictions_gluten_free" boolean DEFAULT false,
  	"restrictions_dairy_free" boolean DEFAULT false,
  	"restrictions_nut_free" boolean DEFAULT true,
  	"restrictions_egg_free" boolean DEFAULT false,
  	"restrictions_vegetarian" boolean DEFAULT false,
  	"restrictions_vegan" boolean DEFAULT false,
  	"restrictions_halal" boolean DEFAULT true,
  	"restrictions_kosher" boolean DEFAULT true,
  	"protein_source" "enum_recipes_protein_source",
  	"carb_source" "enum_recipes_carb_source",
  	"template_base" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ingredients_aliases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "ingredients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"category" "enum_ingredients_category" NOT NULL,
  	"default_unit" "enum_ingredients_default_unit" DEFAULT 'g' NOT NULL,
  	"macros_per100g_calories" numeric NOT NULL,
  	"macros_per100g_protein" numeric NOT NULL,
  	"macros_per100g_carbs" numeric NOT NULL,
  	"macros_per100g_fat" numeric NOT NULL,
  	"macros_per100g_fiber" numeric DEFAULT 0,
  	"macros_per100g_sodium" numeric DEFAULT 0,
  	"restrictions_gluten_free" boolean DEFAULT true,
  	"restrictions_dairy_free" boolean DEFAULT true,
  	"restrictions_nut_free" boolean DEFAULT true,
  	"restrictions_egg_free" boolean DEFAULT true,
  	"restrictions_vegetarian" boolean DEFAULT false,
  	"restrictions_vegan" boolean DEFAULT false,
  	"restrictions_halal" boolean DEFAULT true,
  	"restrictions_kosher" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "exercises_secondary_muscles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_exercises_secondary_muscles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "exercises_equipment" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_exercises_equipment",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "exercises_best_for" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_exercises_best_for",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "exercises_form_cues" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cue" varchar NOT NULL
  );
  
  CREATE TABLE "exercises_common_mistakes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mistake" varchar NOT NULL
  );
  
  CREATE TABLE "exercises" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"primary_muscle" "enum_exercises_primary_muscle" NOT NULL,
  	"difficulty" "enum_exercises_difficulty" NOT NULL,
  	"joint_friendly_knee_friendly" boolean DEFAULT true,
  	"joint_friendly_shoulder_friendly" boolean DEFAULT true,
  	"joint_friendly_back_friendly" boolean DEFAULT true,
  	"joint_friendly_wrist_friendly" boolean DEFAULT true,
  	"minimal_setup" boolean DEFAULT false,
  	"youtube_url" varchar,
  	"muscle_map_key" varchar,
  	"default_sets" numeric DEFAULT 3,
  	"default_reps" varchar DEFAULT '8-12',
  	"rest_seconds" numeric DEFAULT 90,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "meal_plans_day_a_meals" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slot" "enum_meal_plans_day_a_meals_slot" NOT NULL,
  	"recipe_id" integer NOT NULL,
  	"portion_multiplier" numeric DEFAULT 1
  );
  
  CREATE TABLE "meal_plans_day_b_meals" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slot" "enum_meal_plans_day_b_meals_slot",
  	"recipe_id" integer,
  	"portion_multiplier" numeric DEFAULT 1
  );
  
  CREATE TABLE "meal_plans_custom_days_meals" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slot" "enum_meal_plans_custom_days_meals_slot",
  	"recipe_id" integer,
  	"portion_multiplier" numeric DEFAULT 1
  );
  
  CREATE TABLE "meal_plans_custom_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day_of_week" "enum_meal_plans_custom_days_day_of_week"
  );
  
  CREATE TABLE "meal_plans_shopping_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ingredient_id" integer,
  	"total_amount" numeric,
  	"unit" varchar
  );
  
  CREATE TABLE "meal_plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"user_id" integer NOT NULL,
  	"week_start_date" timestamp(3) with time zone NOT NULL,
  	"rotation_type" "enum_meal_plans_rotation_type" DEFAULT 'same_daily' NOT NULL,
  	"macro_targets_calories" numeric NOT NULL,
  	"macro_targets_protein" numeric NOT NULL,
  	"macro_targets_carbs" numeric NOT NULL,
  	"macro_targets_fat" numeric NOT NULL,
  	"meal_prep_instructions" varchar,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "workout_plans_workouts_exercises" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"exercise_id" integer NOT NULL,
  	"sets" numeric DEFAULT 3 NOT NULL,
  	"reps" varchar DEFAULT '8-12' NOT NULL,
  	"rest_seconds" numeric DEFAULT 90,
  	"notes" varchar,
  	"is_locked" boolean DEFAULT false
  );
  
  CREATE TABLE "workout_plans_workouts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day_name" varchar NOT NULL,
  	"day_of_week" "enum_workout_plans_workouts_day_of_week"
  );
  
  CREATE TABLE "workout_plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"user_id" integer NOT NULL,
  	"split_type" "enum_workout_plans_split_type" NOT NULL,
  	"days_per_week" numeric DEFAULT 4 NOT NULL,
  	"goal" "enum_workout_plans_goal" NOT NULL,
  	"cardio_type" "enum_workout_plans_cardio_type",
  	"cardio_duration_minutes" numeric DEFAULT 20,
  	"cardio_frequency" varchar,
  	"daily_steps_target" numeric DEFAULT 10000,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "progress_logs_meals_eaten" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slot" "enum_progress_logs_meals_eaten_slot",
  	"eaten" boolean DEFAULT false,
  	"recipe_id" integer
  );
  
  CREATE TABLE "progress_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"weight_value" numeric,
  	"weight_unit" "enum_progress_logs_weight_unit" DEFAULT 'kg',
  	"waist_value" numeric,
  	"waist_unit" "enum_progress_logs_waist_unit" DEFAULT 'cm',
  	"steps" numeric,
  	"macros_consumed_calories" numeric,
  	"macros_consumed_protein" numeric,
  	"macros_consumed_carbs" numeric,
  	"macros_consumed_fat" numeric,
  	"workout_completed" boolean DEFAULT false,
  	"cardio_completed" boolean DEFAULT false,
  	"cardio_minutes" numeric,
  	"notes" varchar,
  	"is_check_in_day" boolean DEFAULT false,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"recipes_id" integer,
  	"ingredients_id" integer,
  	"exercises_id" integer,
  	"meal_plans_id" integer,
  	"workout_plans_id" integer,
  	"progress_logs_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recipes_goal_tags" ADD CONSTRAINT "recipes_goal_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recipes_ingredients" ADD CONSTRAINT "recipes_ingredients_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recipes_ingredients" ADD CONSTRAINT "recipes_ingredients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recipes_instructions" ADD CONSTRAINT "recipes_instructions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recipes_tags" ADD CONSTRAINT "recipes_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recipes_substitutions" ADD CONSTRAINT "recipes_substitutions_original_id_ingredients_id_fk" FOREIGN KEY ("original_id") REFERENCES "public"."ingredients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recipes_substitutions" ADD CONSTRAINT "recipes_substitutions_substitute_id_ingredients_id_fk" FOREIGN KEY ("substitute_id") REFERENCES "public"."ingredients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recipes_substitutions" ADD CONSTRAINT "recipes_substitutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ingredients_aliases" ADD CONSTRAINT "ingredients_aliases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exercises_secondary_muscles" ADD CONSTRAINT "exercises_secondary_muscles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exercises_equipment" ADD CONSTRAINT "exercises_equipment_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exercises_best_for" ADD CONSTRAINT "exercises_best_for_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exercises_form_cues" ADD CONSTRAINT "exercises_form_cues_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exercises_common_mistakes" ADD CONSTRAINT "exercises_common_mistakes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meal_plans_day_a_meals" ADD CONSTRAINT "meal_plans_day_a_meals_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "meal_plans_day_a_meals" ADD CONSTRAINT "meal_plans_day_a_meals_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meal_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meal_plans_day_b_meals" ADD CONSTRAINT "meal_plans_day_b_meals_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "meal_plans_day_b_meals" ADD CONSTRAINT "meal_plans_day_b_meals_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meal_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meal_plans_custom_days_meals" ADD CONSTRAINT "meal_plans_custom_days_meals_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "meal_plans_custom_days_meals" ADD CONSTRAINT "meal_plans_custom_days_meals_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meal_plans_custom_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meal_plans_custom_days" ADD CONSTRAINT "meal_plans_custom_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meal_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meal_plans_shopping_list" ADD CONSTRAINT "meal_plans_shopping_list_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "meal_plans_shopping_list" ADD CONSTRAINT "meal_plans_shopping_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."meal_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meal_plans" ADD CONSTRAINT "meal_plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "workout_plans_workouts_exercises" ADD CONSTRAINT "workout_plans_workouts_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "workout_plans_workouts_exercises" ADD CONSTRAINT "workout_plans_workouts_exercises_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."workout_plans_workouts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "workout_plans_workouts" ADD CONSTRAINT "workout_plans_workouts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."workout_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "workout_plans" ADD CONSTRAINT "workout_plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "progress_logs_meals_eaten" ADD CONSTRAINT "progress_logs_meals_eaten_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "progress_logs_meals_eaten" ADD CONSTRAINT "progress_logs_meals_eaten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."progress_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "progress_logs" ADD CONSTRAINT "progress_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "progress_logs" ADD CONSTRAINT "progress_logs_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_recipes_fk" FOREIGN KEY ("recipes_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ingredients_fk" FOREIGN KEY ("ingredients_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_exercises_fk" FOREIGN KEY ("exercises_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_meal_plans_fk" FOREIGN KEY ("meal_plans_id") REFERENCES "public"."meal_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_workout_plans_fk" FOREIGN KEY ("workout_plans_id") REFERENCES "public"."workout_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_progress_logs_fk" FOREIGN KEY ("progress_logs_id") REFERENCES "public"."progress_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "recipes_goal_tags_order_idx" ON "recipes_goal_tags" USING btree ("order");
  CREATE INDEX "recipes_goal_tags_parent_idx" ON "recipes_goal_tags" USING btree ("parent_id");
  CREATE INDEX "recipes_ingredients_order_idx" ON "recipes_ingredients" USING btree ("_order");
  CREATE INDEX "recipes_ingredients_parent_id_idx" ON "recipes_ingredients" USING btree ("_parent_id");
  CREATE INDEX "recipes_ingredients_ingredient_idx" ON "recipes_ingredients" USING btree ("ingredient_id");
  CREATE INDEX "recipes_instructions_order_idx" ON "recipes_instructions" USING btree ("_order");
  CREATE INDEX "recipes_instructions_parent_id_idx" ON "recipes_instructions" USING btree ("_parent_id");
  CREATE INDEX "recipes_tags_order_idx" ON "recipes_tags" USING btree ("order");
  CREATE INDEX "recipes_tags_parent_idx" ON "recipes_tags" USING btree ("parent_id");
  CREATE INDEX "recipes_substitutions_order_idx" ON "recipes_substitutions" USING btree ("_order");
  CREATE INDEX "recipes_substitutions_parent_id_idx" ON "recipes_substitutions" USING btree ("_parent_id");
  CREATE INDEX "recipes_substitutions_original_idx" ON "recipes_substitutions" USING btree ("original_id");
  CREATE INDEX "recipes_substitutions_substitute_idx" ON "recipes_substitutions" USING btree ("substitute_id");
  CREATE INDEX "recipes_updated_at_idx" ON "recipes" USING btree ("updated_at");
  CREATE INDEX "recipes_created_at_idx" ON "recipes" USING btree ("created_at");
  CREATE INDEX "ingredients_aliases_order_idx" ON "ingredients_aliases" USING btree ("_order");
  CREATE INDEX "ingredients_aliases_parent_id_idx" ON "ingredients_aliases" USING btree ("_parent_id");
  CREATE INDEX "ingredients_updated_at_idx" ON "ingredients" USING btree ("updated_at");
  CREATE INDEX "ingredients_created_at_idx" ON "ingredients" USING btree ("created_at");
  CREATE INDEX "exercises_secondary_muscles_order_idx" ON "exercises_secondary_muscles" USING btree ("order");
  CREATE INDEX "exercises_secondary_muscles_parent_idx" ON "exercises_secondary_muscles" USING btree ("parent_id");
  CREATE INDEX "exercises_equipment_order_idx" ON "exercises_equipment" USING btree ("order");
  CREATE INDEX "exercises_equipment_parent_idx" ON "exercises_equipment" USING btree ("parent_id");
  CREATE INDEX "exercises_best_for_order_idx" ON "exercises_best_for" USING btree ("order");
  CREATE INDEX "exercises_best_for_parent_idx" ON "exercises_best_for" USING btree ("parent_id");
  CREATE INDEX "exercises_form_cues_order_idx" ON "exercises_form_cues" USING btree ("_order");
  CREATE INDEX "exercises_form_cues_parent_id_idx" ON "exercises_form_cues" USING btree ("_parent_id");
  CREATE INDEX "exercises_common_mistakes_order_idx" ON "exercises_common_mistakes" USING btree ("_order");
  CREATE INDEX "exercises_common_mistakes_parent_id_idx" ON "exercises_common_mistakes" USING btree ("_parent_id");
  CREATE INDEX "exercises_updated_at_idx" ON "exercises" USING btree ("updated_at");
  CREATE INDEX "exercises_created_at_idx" ON "exercises" USING btree ("created_at");
  CREATE INDEX "meal_plans_day_a_meals_order_idx" ON "meal_plans_day_a_meals" USING btree ("_order");
  CREATE INDEX "meal_plans_day_a_meals_parent_id_idx" ON "meal_plans_day_a_meals" USING btree ("_parent_id");
  CREATE INDEX "meal_plans_day_a_meals_recipe_idx" ON "meal_plans_day_a_meals" USING btree ("recipe_id");
  CREATE INDEX "meal_plans_day_b_meals_order_idx" ON "meal_plans_day_b_meals" USING btree ("_order");
  CREATE INDEX "meal_plans_day_b_meals_parent_id_idx" ON "meal_plans_day_b_meals" USING btree ("_parent_id");
  CREATE INDEX "meal_plans_day_b_meals_recipe_idx" ON "meal_plans_day_b_meals" USING btree ("recipe_id");
  CREATE INDEX "meal_plans_custom_days_meals_order_idx" ON "meal_plans_custom_days_meals" USING btree ("_order");
  CREATE INDEX "meal_plans_custom_days_meals_parent_id_idx" ON "meal_plans_custom_days_meals" USING btree ("_parent_id");
  CREATE INDEX "meal_plans_custom_days_meals_recipe_idx" ON "meal_plans_custom_days_meals" USING btree ("recipe_id");
  CREATE INDEX "meal_plans_custom_days_order_idx" ON "meal_plans_custom_days" USING btree ("_order");
  CREATE INDEX "meal_plans_custom_days_parent_id_idx" ON "meal_plans_custom_days" USING btree ("_parent_id");
  CREATE INDEX "meal_plans_shopping_list_order_idx" ON "meal_plans_shopping_list" USING btree ("_order");
  CREATE INDEX "meal_plans_shopping_list_parent_id_idx" ON "meal_plans_shopping_list" USING btree ("_parent_id");
  CREATE INDEX "meal_plans_shopping_list_ingredient_idx" ON "meal_plans_shopping_list" USING btree ("ingredient_id");
  CREATE INDEX "meal_plans_user_idx" ON "meal_plans" USING btree ("user_id");
  CREATE INDEX "meal_plans_updated_at_idx" ON "meal_plans" USING btree ("updated_at");
  CREATE INDEX "meal_plans_created_at_idx" ON "meal_plans" USING btree ("created_at");
  CREATE INDEX "workout_plans_workouts_exercises_order_idx" ON "workout_plans_workouts_exercises" USING btree ("_order");
  CREATE INDEX "workout_plans_workouts_exercises_parent_id_idx" ON "workout_plans_workouts_exercises" USING btree ("_parent_id");
  CREATE INDEX "workout_plans_workouts_exercises_exercise_idx" ON "workout_plans_workouts_exercises" USING btree ("exercise_id");
  CREATE INDEX "workout_plans_workouts_order_idx" ON "workout_plans_workouts" USING btree ("_order");
  CREATE INDEX "workout_plans_workouts_parent_id_idx" ON "workout_plans_workouts" USING btree ("_parent_id");
  CREATE INDEX "workout_plans_user_idx" ON "workout_plans" USING btree ("user_id");
  CREATE INDEX "workout_plans_updated_at_idx" ON "workout_plans" USING btree ("updated_at");
  CREATE INDEX "workout_plans_created_at_idx" ON "workout_plans" USING btree ("created_at");
  CREATE INDEX "progress_logs_meals_eaten_order_idx" ON "progress_logs_meals_eaten" USING btree ("_order");
  CREATE INDEX "progress_logs_meals_eaten_parent_id_idx" ON "progress_logs_meals_eaten" USING btree ("_parent_id");
  CREATE INDEX "progress_logs_meals_eaten_recipe_idx" ON "progress_logs_meals_eaten" USING btree ("recipe_id");
  CREATE INDEX "progress_logs_user_idx" ON "progress_logs" USING btree ("user_id");
  CREATE INDEX "progress_logs_photo_idx" ON "progress_logs" USING btree ("photo_id");
  CREATE INDEX "progress_logs_updated_at_idx" ON "progress_logs" USING btree ("updated_at");
  CREATE INDEX "progress_logs_created_at_idx" ON "progress_logs" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_recipes_id_idx" ON "payload_locked_documents_rels" USING btree ("recipes_id");
  CREATE INDEX "payload_locked_documents_rels_ingredients_id_idx" ON "payload_locked_documents_rels" USING btree ("ingredients_id");
  CREATE INDEX "payload_locked_documents_rels_exercises_id_idx" ON "payload_locked_documents_rels" USING btree ("exercises_id");
  CREATE INDEX "payload_locked_documents_rels_meal_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("meal_plans_id");
  CREATE INDEX "payload_locked_documents_rels_workout_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("workout_plans_id");
  CREATE INDEX "payload_locked_documents_rels_progress_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("progress_logs_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "recipes_goal_tags" CASCADE;
  DROP TABLE "recipes_ingredients" CASCADE;
  DROP TABLE "recipes_instructions" CASCADE;
  DROP TABLE "recipes_tags" CASCADE;
  DROP TABLE "recipes_substitutions" CASCADE;
  DROP TABLE "recipes" CASCADE;
  DROP TABLE "ingredients_aliases" CASCADE;
  DROP TABLE "ingredients" CASCADE;
  DROP TABLE "exercises_secondary_muscles" CASCADE;
  DROP TABLE "exercises_equipment" CASCADE;
  DROP TABLE "exercises_best_for" CASCADE;
  DROP TABLE "exercises_form_cues" CASCADE;
  DROP TABLE "exercises_common_mistakes" CASCADE;
  DROP TABLE "exercises" CASCADE;
  DROP TABLE "meal_plans_day_a_meals" CASCADE;
  DROP TABLE "meal_plans_day_b_meals" CASCADE;
  DROP TABLE "meal_plans_custom_days_meals" CASCADE;
  DROP TABLE "meal_plans_custom_days" CASCADE;
  DROP TABLE "meal_plans_shopping_list" CASCADE;
  DROP TABLE "meal_plans" CASCADE;
  DROP TABLE "workout_plans_workouts_exercises" CASCADE;
  DROP TABLE "workout_plans_workouts" CASCADE;
  DROP TABLE "workout_plans" CASCADE;
  DROP TABLE "progress_logs_meals_eaten" CASCADE;
  DROP TABLE "progress_logs" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_sex";
  DROP TYPE "public"."enum_users_height_unit";
  DROP TYPE "public"."enum_users_current_weight_unit";
  DROP TYPE "public"."enum_users_goal";
  DROP TYPE "public"."enum_users_aggression";
  DROP TYPE "public"."enum_users_dietary_restrictions_dietary_pattern";
  DROP TYPE "public"."enum_users_preferences_cardio_preference";
  DROP TYPE "public"."enum_recipes_goal_tags";
  DROP TYPE "public"."enum_recipes_ingredients_unit";
  DROP TYPE "public"."enum_recipes_tags";
  DROP TYPE "public"."enum_recipes_protein_source";
  DROP TYPE "public"."enum_recipes_carb_source";
  DROP TYPE "public"."enum_ingredients_category";
  DROP TYPE "public"."enum_ingredients_default_unit";
  DROP TYPE "public"."enum_exercises_secondary_muscles";
  DROP TYPE "public"."enum_exercises_equipment";
  DROP TYPE "public"."enum_exercises_best_for";
  DROP TYPE "public"."enum_exercises_primary_muscle";
  DROP TYPE "public"."enum_exercises_difficulty";
  DROP TYPE "public"."enum_meal_plans_day_a_meals_slot";
  DROP TYPE "public"."enum_meal_plans_day_b_meals_slot";
  DROP TYPE "public"."enum_meal_plans_custom_days_meals_slot";
  DROP TYPE "public"."enum_meal_plans_custom_days_day_of_week";
  DROP TYPE "public"."enum_meal_plans_rotation_type";
  DROP TYPE "public"."enum_workout_plans_workouts_day_of_week";
  DROP TYPE "public"."enum_workout_plans_split_type";
  DROP TYPE "public"."enum_workout_plans_goal";
  DROP TYPE "public"."enum_workout_plans_cardio_type";
  DROP TYPE "public"."enum_progress_logs_meals_eaten_slot";
  DROP TYPE "public"."enum_progress_logs_weight_unit";
  DROP TYPE "public"."enum_progress_logs_waist_unit";`)
}
