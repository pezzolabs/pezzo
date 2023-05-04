import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pezzo } from "@pezzo/client";

@Injectable()
export class PezzoClientService {
  public pezzo: Pezzo;

  constructor(configService: ConfigService) {
    this.pezzo = new Pezzo({
      pezzoServerUrl: "http://localhost:3000",
      environment: "development",
      openAIConfiguration: {
        apiKey: configService.get('OPENAI_API_KEY')
      }
    })
  }
}