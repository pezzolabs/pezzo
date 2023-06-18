/*
  Warnings:

  - Added the required column `publishedById` to the `PromptEnvironment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `PromptVersion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromptEnvironment" ADD COLUMN     "publishedById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PromptVersion" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PromptVersion" ADD CONSTRAINT "PromptVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptEnvironment" ADD CONSTRAINT "PromptEnvironment_publishedById_fkey" FOREIGN KEY ("publishedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
