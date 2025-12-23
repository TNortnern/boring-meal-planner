import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Add workout_data column to progress_logs
  await db.execute(sql`
    ALTER TABLE "progress_logs" ADD COLUMN IF NOT EXISTS "workout_data" jsonb;
  `)

  // Create progress_logs_progress_photos table for array field
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "progress_logs_progress_photos" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "url" varchar NOT NULL,
      "type" varchar DEFAULT 'front',
      "uploaded_at" timestamp(3) with time zone
    );
  `)

  // Add foreign key constraint
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'progress_logs_progress_photos_parent_id_fk'
      ) THEN
        ALTER TABLE "progress_logs_progress_photos"
        ADD CONSTRAINT "progress_logs_progress_photos_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "progress_logs"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  // Add index on parent_id and order
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "progress_logs_progress_photos_order_idx" ON "progress_logs_progress_photos" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "progress_logs_progress_photos_parent_id_idx" ON "progress_logs_progress_photos" USING btree ("_parent_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "progress_logs" DROP COLUMN IF EXISTS "workout_data";
    DROP TABLE IF EXISTS "progress_logs_progress_photos";
  `)
}
