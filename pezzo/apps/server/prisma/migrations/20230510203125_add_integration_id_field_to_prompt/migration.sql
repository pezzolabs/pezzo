/*
  Warnings:

  - You are about to drop the column `mode` on the `PromptVersion` table. All the data in the column will be lost.
  - Added the required column `integrationId` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prompt" ADD COLUMN     "integrationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PromptVersion" DROP COLUMN "mode";

-- DropEnum
DROP TYPE "PromptModes";
