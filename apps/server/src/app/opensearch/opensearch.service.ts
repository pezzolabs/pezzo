import { ConfigService } from "@nestjs/config";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { createLogger } from "../logger/create-logger";
import { pino } from "pino";

@Injectable()
export class OpenSearchService implements OnModuleInit {
  public client: Client;
  private logger: pino.Logger;
  public requestsIndexAlias: string;

  constructor(private config: ConfigService) {
    this.logger = createLogger({
      scope: "OpenSearchService",
    });

    this.requestsIndexAlias = config.get("OPENSEARCH_INDEX_REQUESTS_ALIAS");
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
