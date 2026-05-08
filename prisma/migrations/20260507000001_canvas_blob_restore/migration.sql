ALTER TABLE "projects" ADD COLUMN "canvas_json_path" TEXT;
ALTER TABLE "projects" DROP COLUMN IF EXISTS "canvas_json";
