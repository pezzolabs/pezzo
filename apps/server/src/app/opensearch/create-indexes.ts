import { Client } from "@opensearch-project/opensearch";
import { pino } from "pino";
import { OpenSearchIndex } from "./types";

export async function createIndexes(client: Client, _logger: pino.Logger) {
  const logger = _logger.child({ step: "createIndexes" });
  logger.info("Creating indexes");
  await createRequestsIndex(client, logger);
}

export async function createRequestsIndex(
  client: Client,
  _logger: pino.Logger
) {
  const logger = _logger.child({ index: "createRequestsIndex" });
  const index = OpenSearchIndex.Requests;

  const indexExists = await client.indices.exists({
    index,
  });

  if (!indexExists.body) {
    logger.info("Creating index");

    await client.indices.create({
      index,
    });
  } else {
    logger.info("Index already exists, skipping creation");
  }

  logger.info("Index created");
  logger.info("Setting/Updating mappings");

  await client.indices.putMapping({
    index,
    body: {
      properties: {
        ownership: {
          properties: {
            organizationId: {
              type: "keyword",
            },
            projectId: {
              type: "keyword",
            },
          },
        },
        reportId: {
          type: "keyword",
        },
        calculated: {
          properties: {
            promptCost: {
              type: "float",
            },
            completionCost: {
              type: "float",
            },
            totalCost: {
              type: "float",
            },
            promptTokens: {
              type: "integer",
            },
            completionTokens: {
              type: "integer",
            },
            totalTokens: {
              type: "integer",
            },
            duration: {
              type: "integer",
            },
          },
        },
        provider: {
          type: "keyword",
        },
        type: {
          type: "keyword",
        },
        properties: {
          type: "object",
        },
        metadata: {
          properties: {
            promptId: {
              type: "keyword",
            },
            promptVersionSha: {
              type: "keyword",
            },
            conversationId: {
              type: "keyword",
            },
          },
        },
        request: {
          properties: {
            timestamp: {
              type: "date",
            },
            body: {
              type: "object",
            },
          },
        },
        response: {
          properties: {
            timestamp: {
              type: "date",
            },
            status: {
              type: "long",
            },
            body: {
              type: "object",
            },
          },
        },
      },
    },
  });
}
