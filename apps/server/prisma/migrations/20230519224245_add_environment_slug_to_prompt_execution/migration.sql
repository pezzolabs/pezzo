/*
  Warnings:

  - Added the required column `environmentSlug` to the `PromptExecution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromptExecution" ADD COLUMN     "environmentSlug" TEXT NOT NULL;
