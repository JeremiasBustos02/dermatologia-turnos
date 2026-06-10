-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('INVITED', 'ACTIVE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'INVITED';

-- AlterTable
ALTER TABLE "User" ADD COLUMN "invitationToken" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "invitationExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_invitationToken_key" ON "User"("invitationToken");
