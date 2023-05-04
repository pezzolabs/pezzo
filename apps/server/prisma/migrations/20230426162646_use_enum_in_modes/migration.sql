/*
  Warnings:

  - Changed the type of `mode` on the `Prompt` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "mode",
ADD COLUMN     "mode" "PromptModes" NOT NULL;
