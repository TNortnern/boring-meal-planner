import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "meal_plans_day_a_meals" ALTER COLUMN "recipe_id" DROP NOT NULL;
  ALTER TABLE "users" ADD COLUMN "starting_weight" numeric;
  ALTER TABLE "users" ADD COLUMN "goal_weight" numeric;
  ALTER TABLE "meal_plans_day_a_meals" ADD COLUMN "recipe_data" jsonb;
  ALTER TABLE "meal_plans_day_b_meals" ADD COLUMN "recipe_data" jsonb;
  ALTER TABLE "meal_plans_custom_days_meals" ADD COLUMN "recipe_data" jsonb;
  ALTER TABLE "progress_logs" ADD COLUMN "shopping_list_purchased" jsonb;
  ALTER TABLE "progress_logs" ADD COLUMN "measurements_chest" numeric;
  ALTER TABLE "progress_logs" ADD COLUMN "measurements_arms" numeric;
  ALTER TABLE "progress_logs" ADD COLUMN "measurements_thighs" numeric;
  ALTER TABLE "progress_logs" ADD COLUMN "measurements_body_fat" numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "meal_plans_day_a_meals" ALTER COLUMN "recipe_id" SET NOT NULL;
  ALTER TABLE "users" DROP COLUMN "starting_weight";
  ALTER TABLE "users" DROP COLUMN "goal_weight";
  ALTER TABLE "meal_plans_day_a_meals" DROP COLUMN "recipe_data";
  ALTER TABLE "meal_plans_day_b_meals" DROP COLUMN "recipe_data";
  ALTER TABLE "meal_plans_custom_days_meals" DROP COLUMN "recipe_data";
  ALTER TABLE "progress_logs" DROP COLUMN "shopping_list_purchased";
  ALTER TABLE "progress_logs" DROP COLUMN "measurements_chest";
  ALTER TABLE "progress_logs" DROP COLUMN "measurements_arms";
  ALTER TABLE "progress_logs" DROP COLUMN "measurements_thighs";
  ALTER TABLE "progress_logs" DROP COLUMN "measurements_body_fat";`)
}
