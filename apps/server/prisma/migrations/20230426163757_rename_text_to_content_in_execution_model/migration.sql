/*
  Warnings:

  - You are about to drop the column `text` on the `PromptExecution` table. All the data in the column will be lost.
  - Added the required column `content` to the `PromptExecution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromptExecution" DROP COLUMN "text",
ADD COLUMN     "content" TEXT NOT NULL;
