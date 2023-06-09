import dotenv from "dotenv";
import path from "path";

const envfilePath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envfilePath });

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const providerApiKeys = await prisma.providerApiKey.findMany({
    where: {
      organizationId: null,
      projectId: {
        not: null,
      },
    },
    include: {
      project: true,
    },
  });

  console.log(`Found ${providerApiKeys.length} provider api keys to migrate`);

  for (const providerApiKey of providerApiKeys) {
    const project = providerApiKey.project;

    if (!project) {
      continue;
    }

    const organizationId = project.organizationId;

    // Apply organizationId to provider api key
    await prisma.$transaction([
      prisma.providerApiKey.update({
        where: {
          id: providerApiKey.id,
        },
        data: {
          organizationId,
          projectId: null,
        },
      }),
    ]);

    console.log(`Successfully migrated providerApiKey`, {
      providerApiKeyId: providerApiKey.id,
      projectId: project.id,
      organizationId,
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
