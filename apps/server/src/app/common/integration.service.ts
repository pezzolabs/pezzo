import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
// import { OpenAIService } from "@pezzo/integrations";

@Injectable()
export class IntegrationService {
  public openAI: any;

  constructor(configService: ConfigService) {
    // this.openAI = new OpenAIService({
    //   apiKey: configService.get("OPENAI_API_KEY"),
    // });
    this.openAI = {} as any
  }
}
