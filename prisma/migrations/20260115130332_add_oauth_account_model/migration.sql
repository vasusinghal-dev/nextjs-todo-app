-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('github', 'google');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "avatar_url" VARCHAR(500),
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password_hash" DROP NOT NULL;

-- CreateTable
CREATE TABLE "oauth_account" (
    "id" SERIAL NOT NULL,
    "provider" "OAuthProvider" NOT NULL,
    "provider_user_id" VARCHAR(255) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "access_token" VARCHAR(1024),
    "refresh_token" VARCHAR(1024),
    "expires_at" TIMESTAMPTZ,
    "scope" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_oauth_accounts_user_id" ON "oauth_account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_account_provider_provider_user_id_key" ON "oauth_account"("provider", "provider_user_id");

-- AddForeignKey
ALTER TABLE "oauth_account" ADD CONSTRAINT "oauth_account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
