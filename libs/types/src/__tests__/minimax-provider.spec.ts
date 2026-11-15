import {
  PromptService,
  Provider,
  providerDetails,
  promptProvidersMapping,
} from "../provider.types";

describe("MiniMax Provider Types", () => {
  describe("PromptService enum", () => {
    it("should have MiniMaxChatCompletion value", () => {
      expect(PromptService.MiniMaxChatCompletion).toBe(
        "MiniMaxChatCompletion"
      );
    });

    it("should coexist with existing services", () => {
      expect(PromptService.OpenAIChatCompletion).toBeDefined();
      expect(PromptService.AzureOpenAIChatCompletion).toBeDefined();
      expect(PromptService.AnthropicCompletion).toBeDefined();
      expect(PromptService.MiniMaxChatCompletion).toBeDefined();
    });
  });

  describe("Provider enum", () => {
    it("should have MiniMax value", () => {
      expect(Provider.MiniMax).toBe("MiniMax");
    });

    it("should coexist with existing providers", () => {
      expect(Provider.OpenAI).toBeDefined();
      expect(Provider.Azure).toBeDefined();
      expect(Provider.Anthropic).toBeDefined();
      expect(Provider.MiniMax).toBeDefined();
    });
  });

  describe("providerDetails", () => {
    it("should have MiniMax entry with correct name", () => {
      expect(providerDetails[Provider.MiniMax]).toEqual({
        name: "MiniMax",
      });
    });

    it("should not break existing provider details", () => {
      expect(providerDetails[Provider.OpenAI].name).toBe("OpenAI");
      expect(providerDetails[Provider.Azure].name).toBe("Azure");
      expect(providerDetails[Provider.Anthropic].name).toBe("Anthropic");
    });
  });

  describe("promptProvidersMapping", () => {
    it("should map MiniMaxChatCompletion correctly", () => {
      const mapping =
        promptProvidersMapping[PromptService.MiniMaxChatCompletion];
      expect(mapping).toBeDefined();
      expect(mapping.name).toBe("MiniMax Chat Completion");
      expect(mapping.provider).toBe(Provider.MiniMax);
      expect(mapping.defaultSettings).toEqual({});
    });

    it("should not break existing mappings", () => {
      expect(
        promptProvidersMapping[PromptService.OpenAIChatCompletion]
      ).toBeDefined();
      expect(
        promptProvidersMapping[PromptService.AzureOpenAIChatCompletion]
      ).toBeDefined();
      expect(
        promptProvidersMapping[PromptService.AnthropicCompletion]
      ).toBeDefined();
    });
  });
});
