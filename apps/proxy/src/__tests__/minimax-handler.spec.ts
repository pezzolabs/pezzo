import "reflect-metadata";
import axios from "axios";
import { MiniMaxV1Handler } from "../lib/MiniMaxHandler";

jest.mock("axios");
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

describe("MiniMaxV1Handler", () => {
  let mockReq: any;
  let mockRes: any;
  let mockPezzo: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPezzo = {
      options: { environment: "test" },
      reportPromptExecution: jest.fn().mockResolvedValue({}),
      fetchCachedRequest: jest.fn().mockResolvedValue({ hit: false }),
      cacheRequest: jest.fn().mockResolvedValue({}),
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("should proxy non-chat-completion requests to MiniMax API", async () => {
    mockReq = {
      method: "GET",
      headers: {
        authorization: "Bearer test-key",
      },
      originalUrl: "/minimax/v1/models",
      body: {},
      pezzo: mockPezzo,
    };

    mockedAxios.mockResolvedValue({
      status: 200,
      data: { data: [{ id: "MiniMax-M2.7" }] },
    });

    const handler = new MiniMaxV1Handler(mockReq, mockRes);
    await handler.handleRequest();

    expect(mockedAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: "https://api.minimax.io/v1/models",
      })
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("should proxy chat/completions requests and report execution", async () => {
    mockReq = {
      method: "POST",
      headers: {
        authorization: "Bearer test-key",
        "x-pezzo-cache-enabled": "false",
      },
      originalUrl: "/minimax/v1/chat/completions",
      body: {
        model: "MiniMax-M2.7",
        messages: [{ role: "user", content: "Hello" }],
        temperature: 0.7,
      },
      pezzo: mockPezzo,
    };

    const mockResponse = {
      status: 200,
      data: {
        choices: [{ message: { content: "Hi!" } }],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      },
    };

    mockedAxios.mockResolvedValue(mockResponse);

    const handler = new MiniMaxV1Handler(mockReq, mockRes);
    await handler.handleRequest();

    expect(mockedAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "https://api.minimax.io/v1/chat/completions",
      })
    );
    expect(mockPezzo.reportPromptExecution).toHaveBeenCalled();
  });

  it("should clamp temperature to valid MiniMax range", async () => {
    mockReq = {
      method: "POST",
      headers: {
        authorization: "Bearer test-key",
      },
      originalUrl: "/minimax/v1/chat/completions",
      body: {
        model: "MiniMax-M2.7",
        messages: [{ role: "user", content: "Hello" }],
        temperature: 0,
      },
      pezzo: mockPezzo,
    };

    mockedAxios.mockResolvedValue({
      status: 200,
      data: {
        choices: [{ message: { content: "Hi!" } }],
        usage: { prompt_tokens: 10, completion_tokens: 5 },
      },
    });

    const handler = new MiniMaxV1Handler(mockReq, mockRes);
    await handler.handleRequest();

    // Temperature should be clamped to 0.01
    expect(mockReq.body.temperature).toBe(0.01);
  });

  it("should handle cache hits correctly", async () => {
    mockPezzo.fetchCachedRequest.mockResolvedValue({
      hit: true,
      data: {
        choices: [{ message: { content: "Cached response" } }],
      },
    });

    mockReq = {
      method: "POST",
      headers: {
        authorization: "Bearer test-key",
        "x-pezzo-cache-enabled": "true",
      },
      originalUrl: "/minimax/v1/chat/completions",
      body: {
        model: "MiniMax-M2.7",
        messages: [{ role: "user", content: "Hello" }],
      },
      pezzo: mockPezzo,
    };

    const handler = new MiniMaxV1Handler(mockReq, mockRes);
    await handler.handleRequest();

    expect(mockPezzo.fetchCachedRequest).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalled();
    // Should NOT call axios since cache was hit
    expect(mockedAxios).not.toHaveBeenCalled();
  });

  it("should handle API errors gracefully", async () => {
    mockReq = {
      method: "POST",
      headers: {
        authorization: "Bearer test-key",
      },
      originalUrl: "/minimax/v1/chat/completions",
      body: {
        model: "MiniMax-M2.7",
        messages: [{ role: "user", content: "Hello" }],
      },
      pezzo: mockPezzo,
    };

    mockedAxios.mockRejectedValue({
      response: {
        status: 401,
        data: { error: { message: "Invalid API key" } },
      },
    });

    const handler = new MiniMaxV1Handler(mockReq, mockRes);
    await handler.handleRequest();

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockPezzo.reportPromptExecution).toHaveBeenCalled();
  });

  it("should parse x-pezzo-properties header", async () => {
    const properties = { userId: "user-123", traceId: "trace-456" };

    mockReq = {
      method: "POST",
      headers: {
        authorization: "Bearer test-key",
        "x-pezzo-properties": JSON.stringify(properties),
      },
      originalUrl: "/minimax/v1/chat/completions",
      body: {
        model: "MiniMax-M2.7",
        messages: [{ role: "user", content: "Hello" }],
      },
      pezzo: mockPezzo,
    };

    mockedAxios.mockResolvedValue({
      status: 200,
      data: {
        choices: [{ message: { content: "Hi!" } }],
        usage: { prompt_tokens: 10, completion_tokens: 5 },
      },
    });

    const handler = new MiniMaxV1Handler(mockReq, mockRes);
    await handler.handleRequest();

    const reportCall = mockPezzo.reportPromptExecution.mock.calls[0][0];
    expect(reportCall.properties).toEqual(properties);
  });
});
