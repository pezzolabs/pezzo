/*
  Warnings:

  - Added the required column `environmentId` to the `PromptExecution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromptExecution" ADD COLUMN     "environmentId" TEXT NOT NULL;
