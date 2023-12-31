import {
  ObservabilityReportMetadata,
  PromptExecutionType,
  Provider,
} from "@pezzo/types";
import { RequestWithPezzoClient } from "../types/common.types";
import { Response } from "express";
import axios from "axios";

export class OpenAIV1Handler {
  constructor(private req: RequestWithPezzoClient, private res: Response) {}

  async handleRequest() {
    const method = this.req.method;
    const { headers, originalUrl } = this.req;
    const url = originalUrl.replace("/openai/v1", "");
    console.log(`[openai] ${method} ${url}`);

    const execFn = async () => {
      try {
        const result = await axios({
          method,
          url: `https://api.openai.com/v1/${url}`,
          data: this.req.body,
          headers: {
            Authorization: headers.authorization,
          },
        });

        const status = result.status;
        const data = result.data;
        this.res.status(result.status).send(result.data);
        return { status, data };
      } catch (err) {
        this.res.status(err.response.status).send(err.response.data);
        return { status: err.response.status, data: err.response.data };
      }
    };

    if (url.startsWith("/chat/completions")) {
      await this.handleCreateChatCompletion(this.req, this.res, execFn);
    } else {
      await execFn();
    }
  }

  async handleCreateChatCompletion(
    originalRequest: RequestWithPezzoClient,
    originalResponse: Response,
    execFn: any
  ) {
    const pezzo = originalRequest.pezzo;

    let properties = {};
    const isCacheEnabled =
      originalRequest.headers["x-pezzo-cache-enabled"] === "true";
    const hasProperties =
      originalRequest.headers["x-pezzo-properties"] !== undefined;

    if (hasProperties) {
      properties = JSON.parse(
        originalRequest.headers["x-pezzo-properties"] as string
      );
    }

    const baseMetadata: any = {
      environment: pezzo.options.environment,
      provider: Provider.OpenAI,
      type: PromptExecutionType.ChatCompletion,
      client: "pezzo-proxy",
      clientVersion: "0.0.1",
    };

    const requestTimestamp = new Date().toISOString();

    // Report Execution
    const baseReport = {
      cacheEnabled: isCacheEnabled,
      cacheHit: false,
      metadata: baseMetadata,
      properties,
      request: {
        timestamp: requestTimestamp,
        body: originalRequest.body,
      },
    };

    let response;
    let reportPayload;

    if (isCacheEnabled) {
      const cachedRequest = await pezzo.fetchCachedRequest(
        originalRequest.body
      );

      if (cachedRequest.hit === true) {
        baseReport.cacheHit = true;

        console.log("cachedRequest", cachedRequest);

        response = {
          ...cachedRequest.data,
          usage: {
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0,
          },
        };

        reportPayload = {
          ...baseReport,
          response: {
            timestamp: requestTimestamp,
            body: response,
            status: 200,
          },
        };

        originalResponse.status(200).json(response);
      } else {
        baseReport.cacheHit = false;
      }
    }

    if (!isCacheEnabled || (isCacheEnabled && !baseReport.cacheHit)) {
      const { status, data } = await execFn();

      if (status === 200) {
        reportPayload = {
          ...baseReport,
          response: {
            timestamp: new Date().toISOString(),
            body: data,
            status: 200,
          },
        };
      } else {
        reportPayload = {
          ...baseReport,
          response: {
            timestamp: new Date().toISOString(),
            body: data,
            status: status,
          },
        };
      }
    }

    const shouldWriteToCache =
      isCacheEnabled &&
      reportPayload.cacheHit === false &&
      reportPayload.response.status === 200;

    try {
      if (shouldWriteToCache) {
        await Promise.all([
          pezzo.reportPromptExecution(reportPayload),
          pezzo.cacheRequest(originalRequest.body, reportPayload.response.body),
        ]);
      } else {
        await pezzo.reportPromptExecution(reportPayload);
      }
    } catch (error) {
      console.error("Error reporting prompt execution", error);
    }
  }
}
