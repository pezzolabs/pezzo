/*
  Warnings:

  - You are about to drop the `PromptExecution` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PromptExecution" DROP CONSTRAINT "PromptExecution_promptId_fkey";

-- DropTable
DROP TABLE "PromptExecution";

-- DropEnum
DROP TYPE "PromptExecutionStatus";
