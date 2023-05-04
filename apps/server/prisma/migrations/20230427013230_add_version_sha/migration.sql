/*
  Warnings:

  - Added the required column `promptVersionSha` to the `PromptEnvironment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromptEnvironment" ADD COLUMN     "promptVersionSha" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PromptEnvironment" ADD CONSTRAINT "PromptEnvironment_promptVersionSha_fkey" FOREIGN KEY ("promptVersionSha") REFERENCES "PromptVersion"("sha") ON DELETE RESTRICT ON UPDATE CASCADE;
