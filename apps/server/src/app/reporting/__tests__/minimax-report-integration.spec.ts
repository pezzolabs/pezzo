import "reflect-metadata";
import { buildRequestReport } from "../utils/build-request-report";
import { Provider } from "@pezzo/types";

/**
 * Integration tests for MiniMax report building - verifies the full
 * report generation pipeline works with MiniMax data.
 */
describe("MiniMax Report Builder Integration", () => {
  it("should produce complete report with all calculated fields for MiniMax", () => {
    const dto = {
      metadata: {
        model: "MiniMax-M2.7",
        modelAuthor: "MiniMax",
        provider: Provider.MiniMax,
        client: "pezzo-ts",
        clientVersion: "0.0.1",
        environment: "Production",
        promptId: "test-prompt-1",
      },
      request: {
        timestamp: "2024-06-15T10:00:00.000Z",
        body: {
          model: "MiniMax-M2.7",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: "What is 2+2?" },
          ],
          temperature: 0.7,
          max_tokens: 100,
        },
      },
      response: {
        timestamp: "2024-06-15T10:00:02.500Z",
        body: {
          id: "chatcmpl-test",
          object: "chat.completion",
          created: 1718445600,
          model: "MiniMax-M2.7",
          choices: [
            {
              index: 0,
              message: { role: "assistant", content: "2+2 equals 4." },
              finish_reason: "stop",
            },
          ],
          usage: {
            prompt_tokens: 25,
            completion_tokens: 8,
            total_tokens: 33,
          },
        },
        status: 200,
      },
      cacheEnabled: false,
      cacheHit: false,
    };

    const result = buildRequestReport(dto as any);

    // Verify structure
    expect(result.report).toBeDefined();
    expect(result.calculated).toBeDefined();

    // Verify calculated fields
    const calc = result.calculated as any;
    expect(calc.duration).toBe(2500);
    expect(calc.promptTokens).toBe(25);
    expect(calc.completionTokens).toBe(8);
    expect(calc.totalTokens).toBe(33);

    // Verify cost calculation
    expect(calc.promptCost).toBeGreaterThan(0);
    expect(calc.completionCost).toBeGreaterThan(0);
    expect(calc.totalCost).toBe(
      parseFloat(
        (calc.promptCost + calc.completionCost).toFixed(6)
      )
    );
  });

  it("should handle all MiniMax model variants", () => {
    const models = [
      "MiniMax-M2.7",
      "MiniMax-M2.7-highspeed",
      "MiniMax-M2.5",
      "MiniMax-M2.5-highspeed",
    ];

    for (const model of models) {
      const dto = {
        metadata: {
          model,
          modelAuthor: "MiniMax",
          provider: Provider.MiniMax,
          client: "pezzo-ts",
          clientVersion: "0.0.1",
          environment: "test",
          promptId: "",
        },
        request: {
          timestamp: "2024-01-01T00:00:00.000Z",
          body: { model, messages: [{ role: "user", content: "Test" }] },
        },
        response: {
          timestamp: "2024-01-01T00:00:01.000Z",
          body: {
            usage: {
              prompt_tokens: 1000,
              completion_tokens: 500,
            },
          },
          status: 200,
        },
        cacheEnabled: false,
        cacheHit: false,
      };

      const result = buildRequestReport(dto as any);
      const calc = result.calculated as any;
      expect(calc.promptCost).toBeGreaterThan(0);
      expect(calc.completionCost).toBeGreaterThan(0);
      expect(calc.totalTokens).toBe(1500);
    }
  });

  it("should handle MiniMax and OpenAI reports in the same system", () => {
    // MiniMax report
    const minimaxDto = {
      metadata: {
        model: "MiniMax-M2.7",
        modelAuthor: "MiniMax",
        provider: Provider.MiniMax,
        client: "pezzo-ts",
        clientVersion: "0.0.1",
        environment: "test",
        promptId: "",
      },
      request: {
        timestamp: "2024-01-01T00:00:00.000Z",
        body: {
          model: "MiniMax-M2.7",
          messages: [{ role: "user", content: "Hello" }],
        },
      },
      response: {
        timestamp: "2024-01-01T00:00:01.000Z",
        body: {
          usage: { prompt_tokens: 100, completion_tokens: 50 },
        },
        status: 200,
      },
      cacheEnabled: false,
      cacheHit: false,
    };

    // OpenAI report
    const openaiDto = {
      ...minimaxDto,
      metadata: {
        ...minimaxDto.metadata,
        provider: Provider.OpenAI,
        model: "gpt-3.5-turbo",
        modelAuthor: "OpenAI",
      },
      request: {
        ...minimaxDto.request,
        body: {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: "Hello" }],
        },
      },
    };

    const minimaxResult = buildRequestReport(minimaxDto as any);
    const openaiResult = buildRequestReport(openaiDto as any);

    // Both should produce valid reports
    expect((minimaxResult.calculated as any).totalTokens).toBe(150);
    expect((openaiResult.calculated as any).totalTokens).toBe(150);

    // Costs should differ between providers
    expect((minimaxResult.calculated as any).totalCost).not.toBe(
      (openaiResult.calculated as any).totalCost
    );
  });
});
