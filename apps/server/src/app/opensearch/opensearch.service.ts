import { ConfigService } from "@nestjs/config";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { createLogger } from "../logger/create-logger";
import { createIndexes } from "./create-indexes";
import { pino } from "pino";

@Injectable()
export class OpenSearchService implements OnModuleInit {
  public client: Client;
  private logger: pino.Logger;

  constructor(private config: ConfigService) {
    this.logger = createLogger({
      scope: "OpenSearchService",
    });
  }

  async onModuleInit() {
    const node = this.config.get("OPENSEARCH_URL");
    const authMode = this.config.get("OPENSEARCH_AUTH");

    if (authMode === "insecure") {
      this.logger.info("Creating OpenSearch client in insecure mode");
      this.client = new Client({
        node,
      });
    }

    if (authMode === "aws") {
      this.logger.info("Creating OpenSearch client using AWS credentials");
      const signer = AwsSigv4Signer({
        region: "us-east-1",
        getCredentials: async () => {
          const provider = defaultProvider();
          return provider();
        },
      });

      this.client = new Client({
        ...signer,
        node,
      });
    }

    await this.healthCheck();
    await createIndexes(this.client, this.logger);
  }

  async healthCheck() {
    try {
      const { meta } = await this.client.cluster.health();
      this.logger.info(
        { status: meta.connection.status },
        "OpenSearch healthcheck"
      );
    } catch (error) {
      this.logger.error({ error }, "OpenSearch healthcheck failed");
      throw error;
    }
  }
}
