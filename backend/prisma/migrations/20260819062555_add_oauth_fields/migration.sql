-- AlterTable
ALTER TABLE "users" ADD COLUMN     "auth_provider" TEXT NOT NULL DEFAULT 'local',
ADD COLUMN     "provider_id" TEXT,
ALTER COLUMN "user_password" DROP NOT NULL;
