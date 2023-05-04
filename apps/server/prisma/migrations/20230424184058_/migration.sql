/*
  Warnings:

  - Added the required column `text` to the `PromptExecution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromptExecution" ADD COLUMN     "text" TEXT NOT NULL;
