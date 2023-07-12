-- DropForeignKey
ALTER TABLE "PromptEnvironment" DROP CONSTRAINT "PromptEnvironment_environmentId_fkey";

-- AddForeignKey
ALTER TABLE "PromptEnvironment" ADD CONSTRAINT "PromptEnvironment_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
