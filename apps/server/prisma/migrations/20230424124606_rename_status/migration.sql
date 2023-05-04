/*
  Warnings:

  - The values [SUCCESS,ERROR] on the enum `PromptExecutionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PromptExecutionStatus_new" AS ENUM ('Success', 'Error');
ALTER TABLE "PromptExecution" ALTER COLUMN "status" TYPE "PromptExecutionStatus_new" USING ("status"::text::"PromptExecutionStatus_new");
ALTER TYPE "PromptExecutionStatus" RENAME TO "PromptExecutionStatus_old";
ALTER TYPE "PromptExecutionStatus_new" RENAME TO "PromptExecutionStatus";
DROP TYPE "PromptExecutionStatus_old";
COMMIT;
