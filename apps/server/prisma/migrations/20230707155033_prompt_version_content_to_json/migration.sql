/*
  Warnings:

  - Changed the type of `content` on the `PromptVersion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
BEGIN;

-- CreateEnum
CREATE TYPE "PromptType" AS ENUM ('Prompt', 'Chat');

-- Step 1: Add the tempContent column to the PromptVersion table
ALTER TABLE "PromptVersion" ADD COLUMN "tempContent" TEXT;

-- Step 2: Copy the content from the content column to the tempContent column, replacing nulls with an empty string
UPDATE "PromptVersion" SET "tempContent" = COALESCE("content", '');

-- AlterTable
ALTER TABLE "PromptVersion" 
DROP COLUMN "content",
ADD COLUMN "content" JSONB;

ALTER TABLE "PromptVersion" ALTER COLUMN "settings" SET DEFAULT '{}';

-- Step 4: Format the tempContent into a JSON structure and copy it to the content column
UPDATE "PromptVersion" SET "content" = jsonb_build_object('prompt', "tempContent");

-- Step 5: Drop the tempContent column
ALTER TABLE "PromptVersion" ALTER COLUMN "content" SET NOT NULL;
ALTER TABLE "PromptVersion" DROP COLUMN "tempContent";

-- Step 6: Flatten the settings column
UPDATE "PromptVersion"
SET "settings" = jsonb_build_object(
  'OPENAI_CHAT_COMPLETION', jsonb_build_object(
    'model', "settings" -> 'model',
    'top_p', "settings" -> 'modelSettings' -> 'top_p',
    'max_tokens', "settings" -> 'modelSettings' -> 'max_tokens',
    'temperature', "settings" -> 'modelSettings' -> 'temperature',
    'presence_penalty', "settings" -> 'modelSettings' -> 'presence_penalty',
    'frequency_penalty', "settings" -> 'modelSettings' -> 'frequency_penalty'
  )
);

-- Step 7: Add the new type column with a temporary default value
ALTER TABLE "Prompt" ADD COLUMN "type" "PromptType" NOT NULL DEFAULT E'Prompt';

-- Remove the default constraint
ALTER TABLE "Prompt" ALTER COLUMN "type" DROP DEFAULT;

COMMIT;