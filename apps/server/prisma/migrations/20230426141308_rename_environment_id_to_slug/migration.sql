/*
  Warnings:

  - You are about to drop the column `environmentId` on the `PromptEnvironment` table. All the data in the column will be lost.
  - Added the required column `environmentSlug` to the `PromptEnvironment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PromptEnvironment" DROP CONSTRAINT "PromptEnvironment_environmentId_fkey";

-- AlterTable
ALTER TABLE "PromptEnvironment" DROP COLUMN "environmentId",
ADD COLUMN     "environmentSlug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PromptEnvironment" ADD CONSTRAINT "PromptEnvironment_environmentSlug_fkey" FOREIGN KEY ("environmentSlug") REFERENCES "Environment"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
