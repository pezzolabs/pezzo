import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OpenAIService } from "@pezzo/integrations";

@Injectable()
export class IntegrationService {
  public openAI: OpenAIService;

  constructor(configService: ConfigService) {
    this.openAI = new OpenAIService({
      apiKey: configService.get("OPENAI_API_KEY"),
    });
  }
}
