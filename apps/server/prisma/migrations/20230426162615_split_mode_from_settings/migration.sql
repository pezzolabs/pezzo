/*
  Warnings:

  - Added the required column `mode` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PromptModes" AS ENUM ('Chat');

-- AlterTable
ALTER TABLE "Prompt" ADD COLUMN     "mode" TEXT NOT NULL;
