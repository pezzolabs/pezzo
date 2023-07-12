/*
  Warnings:

  - You are about to drop the column `integrationId` on the `Prompt` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PromptEnvironment" DROP CONSTRAINT "PromptEnvironment_promptId_fkey";

-- DropForeignKey
ALTER TABLE "PromptExecution" DROP CONSTRAINT "PromptExecution_promptId_fkey";

-- DropForeignKey
ALTER TABLE "PromptVersion" DROP CONSTRAINT "PromptVersion_promptId_fkey";

-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "integrationId";

-- AddForeignKey
ALTER TABLE "PromptVersion" ADD CONSTRAINT "PromptVersion_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptEnvironment" ADD CONSTRAINT "PromptEnvironment_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptExecution" ADD CONSTRAINT "PromptExecution_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
