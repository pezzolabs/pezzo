import { PromptExecutionType, Provider } from "@pezzo/types";
import { RequestWithPezzoClient } from "../types/common.types";
import { Response } from "express";
import axios from "axios";

const MINIMAX_API_BASE = "https://api.minimax.io/v1";

export class MiniMaxV1Handler {
  constructor(private req: RequestWithPezzoClient, private res: Response) {}

  async handleRequest() {
    const method = this.req.method;
    const { headers, originalUrl } = this.req;
    const url = originalUrl.replace("/minimax/v1", "");
    console.log(`[minimax] ${method} ${url}`);

    const execFn = async () => {
      try {
        const result = await axios({
          method,
          url: `${MINIMAX_API_BASE}${url}`,
          data: this.req.body,
          headers: {
            Authorization: headers.authorization,
            "Content-Type": "application/json",
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

    // Clamp temperature for MiniMax (must be in (0.0, 1.0])
    if (originalRequest.body?.temperature !== undefined) {
      originalRequest.body.temperature = Math.max(
        0.01,
        Math.min(1, originalRequest.body.temperature)
      );
    }

    const baseMetadata: any = {
      environment: pezzo.options.environment,
      provider: Provider.MiniMax,
      type: PromptExecutionType.ChatCompletion,
      client: "pezzo-proxy",
      clientVersion: "0.0.1",
    };

    const requestTimestamp = new Date().toISOString();

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
