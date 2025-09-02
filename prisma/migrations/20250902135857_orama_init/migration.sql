-- AlterTable
ALTER TABLE "public"."Account" ADD COLUMN     "oramaIndex" JSONB;

-- DropEnum
DROP TYPE "public"."Role";
