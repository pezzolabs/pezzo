// This migration script is part of the 0.4.0 release

import { PrismaClient } from "@prisma/client";
import { CreateChatCompletionRequest } from "openai";

const prisma = new PrismaClient();

async function main() {
  let migratedCount = 0;

  console.log("Running migration script");
  const promptVersions = await prisma.promptVersion.findMany({
    where: {
      content: {
        not: "MIGRATED",
      },
    },
  });
  console.log(
    `Found ${promptVersions.length} prompt versions pending migration`
  );

  for (const promptVersion of promptVersions) {
    const currentSettings = promptVersion.settings as any;
    const currentContent = promptVersion.content;

    const newSettings: CreateChatCompletionRequest = {
      model: currentSettings.model,
      ...currentSettings.modelSettings,
      messages: [
        {
          role: "user",
          content: currentContent,
        },
      ],
    };

    await prisma.promptVersion.update({
      where: {
        sha: promptVersion.sha,
      },
      data: {
        settings: newSettings as any,
        content: "MIGRATED",
      },
    });

    console.log("Migrated prompt version", promptVersion.sha);
    migratedCount++;
  }

  console.log(`Migrated ${migratedCount} prompt versions`);
}

main();
