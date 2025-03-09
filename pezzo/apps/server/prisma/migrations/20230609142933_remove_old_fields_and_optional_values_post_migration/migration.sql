/*
  Warnings:

  - You are about to drop the column `environmentId` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `ProviderApiKey` table. All the data in the column will be lost.
  - Made the column `organizationId` on table `ApiKey` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `ProviderApiKey` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_environmentId_fkey";

-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "ProviderApiKey" DROP CONSTRAINT "ProviderApiKey_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "ProviderApiKey" DROP CONSTRAINT "ProviderApiKey_projectId_fkey";

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "environmentId",
ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProviderApiKey" DROP COLUMN "projectId",
ALTER COLUMN "organizationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderApiKey" ADD CONSTRAINT "ProviderApiKey_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
