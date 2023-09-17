/*
  Warnings:

  - You are about to drop the column `value` on the `ProviderApiKey` table. All the data in the column will be lost.
  - Added the required column `censoredValue` to the `ProviderApiKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encryptedData` to the `ProviderApiKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encryptedDataKey` to the `ProviderApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProviderApiKey" DROP COLUMN "value",
ADD COLUMN     "censoredValue" TEXT NOT NULL,
ADD COLUMN     "encryptedData" TEXT NOT NULL,
ADD COLUMN     "encryptedDataKey" TEXT NOT NULL;
