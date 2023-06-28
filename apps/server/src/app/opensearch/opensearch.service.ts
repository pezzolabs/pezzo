import { Injectable, OnModuleInit } from "@nestjs/common";
import { Client } from "@opensearch-project/opensearch";
import { ConfigService } from "@nestjs/config";
import { createLogger } from "../logger/create-logger";
import { createIndexes } from "./create-indexes";

@Injectable()
export class OpenSearchService implements OnModuleInit {
  public client: Client;

  constructor(private config: ConfigService) {
    this.client = new Client({
      node: this.config.get("OPENSEARCH_URL"),
    });
  }

  async onModuleInit() {
    const logger = createLogger({
      scope: "OpenSearchService.onModuleInit",
    });

    await createIndexes(this.client, logger);
  }
}
