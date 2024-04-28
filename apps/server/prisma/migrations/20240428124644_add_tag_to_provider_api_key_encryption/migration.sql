/*
  Warnings:

  - Added the required column `encryptionTag` to the `ProviderApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProviderApiKey" ADD COLUMN     "encryptionTag" TEXT NOT NULL;
