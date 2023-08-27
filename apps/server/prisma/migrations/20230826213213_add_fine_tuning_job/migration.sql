-- CreateTable
CREATE TABLE "FineTuningJob" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "requestIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FineTuningJob_pkey" PRIMARY KEY ("id")
);
