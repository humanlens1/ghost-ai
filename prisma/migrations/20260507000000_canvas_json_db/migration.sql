-- Replace blob URL pointer with inline JSONB storage
ALTER TABLE "projects" ADD COLUMN "canvas_json" JSONB;
ALTER TABLE "projects" DROP COLUMN IF EXISTS "canvas_json_path";
