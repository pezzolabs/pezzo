-- CreateTable
CREATE TABLE "ProviderAPIKey" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderAPIKey_pkey" PRIMARY KEY ("id")
);
