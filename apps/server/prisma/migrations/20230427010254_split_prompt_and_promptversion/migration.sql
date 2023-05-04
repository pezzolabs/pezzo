/*
  Warnings:

  - You are about to drop the column `content` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `mode` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `settings` on the `Prompt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "content",
DROP COLUMN "mode",
DROP COLUMN "settings";

-- CreateTable
CREATE TABLE "PromptVersion" (
    "sha" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mode" "PromptModes" NOT NULL,
    "settings" JSONB NOT NULL,
    "promptId" TEXT NOT NULL,

    CONSTRAINT "PromptVersion_pkey" PRIMARY KEY ("sha")
);

-- AddForeignKey
ALTER TABLE "PromptVersion" ADD CONSTRAINT "PromptVersion_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
