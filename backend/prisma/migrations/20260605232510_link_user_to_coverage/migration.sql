-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coverageId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_coverageId_fkey" FOREIGN KEY ("coverageId") REFERENCES "Coverage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
