/*
  Warnings:

  - Added the required column `promptVersionSha` to the `PromptExecution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromptExecution" ADD COLUMN     "promptVersionSha" TEXT NOT NULL;
