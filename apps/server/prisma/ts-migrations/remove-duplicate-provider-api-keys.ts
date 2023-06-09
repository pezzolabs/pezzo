import dotenv from "dotenv";
import path from "path";

const envfilePath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envfilePath });

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const providerApiKeys = await prisma.providerApiKey.findMany();

  console.log("providerApiKeys", providerApiKeys);

  const map = new Map();

  for (const providerApiKey of providerApiKeys) {
    const key = `${providerApiKey.provider}-${providerApiKey.organizationId}`;

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key).push(providerApiKey.id);
  }

  let duplicates: any = [];

  for (const ids of map.values()) {
    ids.shift();
    duplicates = [...duplicates, ...ids];
  }

  console.log(
    `Found ${duplicates.length} duplicates out of ${providerApiKeys.length} provider api keys`
  );

  for (const id of duplicates) {
    console.log(`Deleting providerApiKey ${id}`);
    await prisma.providerApiKey.delete({
      where: {
        id,
      },
    });
    console.log(`Successfully deleted providerApiKey ${id}`);
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
