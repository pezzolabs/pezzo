/*
  Warnings:

  - You are about to drop the column `projectId` on the `ApiKey` table. All the data in the column will be lost.
  - Added the required column `environmentId` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_projectId_fkey";

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "projectId",
ADD COLUMN     "environmentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
