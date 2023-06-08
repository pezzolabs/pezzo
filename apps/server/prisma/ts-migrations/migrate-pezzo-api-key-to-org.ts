import dotenv from "dotenv";
import path from "path";

const envfilePath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envfilePath });

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const pezzoApiKeys = await prisma.apiKey.findMany({
    where: {
      organizationId: null,
      environmentId: {
        not: null,
      },
    },
    include: {
      environment: true,
    },
  });

  console.log(`Found ${pezzoApiKeys.length} Pezzo api keys to migrate`);

  for (const apiKey of pezzoApiKeys) {
    console.log(`Migrating api key`, { apiKeyId: apiKey.id });
    const env = apiKey.environment;

    if (!env) {
      console.log(`Could not find environment for api key`, {
        apiKeyId: apiKey.id,
      });
      continue;
    }

    const project = await prisma.project.findUnique({
      where: { id: env.projectId },
    });

    if (!project) {
      console.log(`Could not find project for environment`, {
        environmentId: env.id,
      });
      continue;
    }

    const organizationId = project.organizationId;

    // Apply organizationId to provider api key
    await prisma.$transaction([
      prisma.apiKey.update({
        where: {
          id: apiKey.id,
        },
        data: {
          organizationId,
          environmentId: null,
        },
      }),
    ]);

    console.log(`Successfully migrated providerApiKey`, {
      apiKeyId: apiKey.id,
      projectId: project.id,
      environmentId: env.id,
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
