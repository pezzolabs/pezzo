import "reflect-metadata";
import { buildRequestReport } from "../utils/build-request-report";
import { Provider } from "@pezzo/types";

describe("MiniMax Report Builder", () => {
  const baseDto = {
    metadata: {
      model: "MiniMax-M2.7",
      modelAuthor: "MiniMax",
      provider: Provider.MiniMax,
      client: "pezzo-ts",
      clientVersion: "0.0.1",
      environment: "Production",
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
        usage: {
          prompt_tokens: 100,
          completion_tokens: 50,
        },
      },
      status: 200,
    },
    cacheEnabled: false,
    cacheHit: false,
  };

  it("should build a MiniMax report with cost calculation", () => {
    const result = buildRequestReport(baseDto as any);
    const calc = result.calculated as any;
    expect(calc).toBeDefined();
    expect(calc.duration).toBe(1000);
    expect(calc.promptTokens).toBe(100);
    expect(calc.completionTokens).toBe(50);
    expect(calc.totalTokens).toBe(150);
    expect(calc.promptCost).toBeGreaterThan(0);
    expect(calc.completionCost).toBeGreaterThan(0);
    expect(calc.totalCost).toBeGreaterThan(0);
  });

  it("should calculate correct cost for MiniMax-M2.7", () => {
    const result = buildRequestReport(baseDto as any);
    const calc = result.calculated as any;
    // M2.7: $1.5/1M prompt, $5.5/1M completion
    const expectedPromptCost = (100 / 1_000_000) * 1.5;
    const expectedCompletionCost = (50 / 1_000_000) * 5.5;
    expect(calc.promptCost).toBeCloseTo(expectedPromptCost, 6);
    expect(calc.completionCost).toBeCloseTo(expectedCompletionCost, 6);
  });

  it("should calculate correct cost for MiniMax-M2.5-highspeed", () => {
    const dto = {
      ...baseDto,
      request: {
        ...baseDto.request,
        body: {
          ...baseDto.request.body,
          model: "MiniMax-M2.5-highspeed",
        },
      },
    };
    const result = buildRequestReport(dto as any);
    const calc = result.calculated as any;
    // M2.5-highspeed: $0.5/1M prompt, $2.0/1M completion
    const expectedPromptCost = (100 / 1_000_000) * 0.5;
    const expectedCompletionCost = (50 / 1_000_000) * 2.0;
    expect(calc.promptCost).toBeCloseTo(expectedPromptCost, 6);
    expect(calc.completionCost).toBeCloseTo(expectedCompletionCost, 6);
  });

  it("should handle missing usage gracefully", () => {
    const dto = {
      ...baseDto,
      response: {
        ...baseDto.response,
        body: {},
      },
    };
    const result = buildRequestReport(dto as any);
    const calc = result.calculated as any;
    expect(calc.duration).toBe(1000);
    expect(calc.promptCost).toBeUndefined();
  });

  it("should use fallback pricing for unknown MiniMax models", () => {
    const dto = {
      ...baseDto,
      request: {
        ...baseDto.request,
        body: {
          ...baseDto.request.body,
          model: "MiniMax-Future-Model",
        },
      },
    };
    const result = buildRequestReport(dto as any);
    const calc = result.calculated as any;
    expect(calc.promptCost).toBeGreaterThan(0);
    expect(calc.completionCost).toBeGreaterThan(0);
  });

  it("should still handle OpenAI reports correctly", () => {
    const openAIDto = {
      ...baseDto,
      metadata: {
        ...baseDto.metadata,
        provider: Provider.OpenAI,
      },
      request: {
        ...baseDto.request,
        body: {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: "Hello" }],
        },
      },
    };
    // Should not throw for OpenAI reports
    expect(() => buildRequestReport(openAIDto as any)).not.toThrow();
  });
});
