-- CreateEnum
CREATE TYPE "PromptModes" AS ENUM ('Chat');

-- CreateEnum
CREATE TYPE "PromptExecutionStatus" AS ENUM ('Success', 'Error');

-- CreateTable
CREATE TABLE "Environment" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Environment_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Prompt" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptVersion" (
    "sha" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mode" "PromptModes" NOT NULL,
    "settings" JSONB NOT NULL,
    "promptId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT,

    CONSTRAINT "PromptVersion_pkey" PRIMARY KEY ("sha")
);

-- CreateTable
CREATE TABLE "PromptEnvironment" (
    "id" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "environmentSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "promptVersionSha" TEXT NOT NULL,

    CONSTRAINT "PromptEnvironment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptExecution" (
    "id" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "promptVersionSha" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "PromptExecutionStatus" NOT NULL,
    "content" TEXT NOT NULL,
    "interpolatedContent" TEXT NOT NULL,
    "settings" JSONB NOT NULL,
    "result" TEXT,
    "duration" INTEGER NOT NULL,
    "promptTokens" INTEGER NOT NULL,
    "completionTokens" INTEGER NOT NULL,
    "totalTokens" INTEGER NOT NULL,
    "promptCost" DOUBLE PRECISION NOT NULL,
    "completionCost" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "error" TEXT,
    "variables" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "PromptExecution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PromptVersion" ADD CONSTRAINT "PromptVersion_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptEnvironment" ADD CONSTRAINT "PromptEnvironment_environmentSlug_fkey" FOREIGN KEY ("environmentSlug") REFERENCES "Environment"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptEnvironment" ADD CONSTRAINT "PromptEnvironment_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptEnvironment" ADD CONSTRAINT "PromptEnvironment_promptVersionSha_fkey" FOREIGN KEY ("promptVersionSha") REFERENCES "PromptVersion"("sha") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptExecution" ADD CONSTRAINT "PromptExecution_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
