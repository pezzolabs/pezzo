-- AlterTable
ALTER TABLE "PromptExecution" ADD COLUMN     "variables" JSONB NOT NULL DEFAULT '{}';
