/*
  Warnings:

  - Made the column `encryptionTag` on table `ProviderApiKey` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProviderApiKey" ALTER COLUMN "encryptionTag" SET NOT NULL;
