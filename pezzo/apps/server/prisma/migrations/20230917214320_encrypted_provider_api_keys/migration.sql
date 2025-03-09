/*
  Warnings:

  - You are about to drop the column `value` on the `ProviderApiKey` table. All the data in the column will be lost.
  - Added the required column `censoredValue` to the `ProviderApiKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encryptedData` to the `ProviderApiKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encryptedDataKey` to the `ProviderApiKey` table without a default value. This is not possible if the table is not empty.

*/

-- DropTable
DROP TABLE IF EXISTS "ProviderApiKey";

-- CreateTable
CREATE TABLE "ProviderApiKey" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "censoredValue" TEXT NOT NULL,
    "encryptedData" TEXT NOT NULL,
    "encryptedDataKey" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderApiKey_pkey" PRIMARY KEY ("id")
);