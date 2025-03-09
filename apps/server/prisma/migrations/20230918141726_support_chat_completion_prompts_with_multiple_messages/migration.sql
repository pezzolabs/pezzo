/*
  Warnings:

  - You are about to drop the column `type` on the `Prompt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "PromptVersion" ADD COLUMN     "type" "PromptType" NOT NULL DEFAULT 'Prompt';

-- AddForeignKey
ALTER TABLE "ProviderApiKey" ADD CONSTRAINT "ProviderApiKey_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
