import axios, { AxiosInstance } from "axios";
import { Settings } from "./types";
import {
  BaseIntegration,
  BaseIntegrationOptions,
  ExecuteProps,
  ExecuteResult,
} from "../BaseIntegration";

interface AI21IntegrationOptions extends BaseIntegrationOptions {
  apiKey: string;
}

export class AI21Integration extends BaseIntegration {
  private readonly axios: AxiosInstance;
  private readonly apiKey: string;

  constructor(options: AI21IntegrationOptions) {
    super({
      pezzoServerURL: options.pezzoServerURL,
      environment: options.environment,
    });

    this.axios = axios.create({
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  async execute<T>(props: ExecuteProps<Settings>): Promise<ExecuteResult<T>> {
    const { settings, content } = props;
    const url = `https://api.ai21.com/studio/v1/${settings.model}/complete`;

    const result = await this.axios.post(url, {
      prompt: content,
      ...settings.modelSettings
    });

    const data = result.data as any;

    const promptTokens = data.prompt.tokens.length;
    const completionTokens = data.completions[0].data.tokens.length;
    const costPer1000Tokens = this.getCostPer1000Tokens(settings.model);

    const promptCost = (promptTokens / 1000) * costPer1000Tokens;
    const completionCost = (completionTokens / 1000) * costPer1000Tokens;

    return {
      promptTokens,
      completionTokens,
      promptCost,
      completionCost,
      result: data.completions[0].data.text,
    };
  }

  private getCostPer1000Tokens(model: string) {
    switch (model) {
      case "j2-jumbo-instruct":
        return 0.015;
      case "j2-jumbo":
        return 0.015;
      case "j2-grande-instruct":
        return 0.01;
      case "j2-grande":
        return 0.01;
      default:
        return 0;
    }
  }
}
