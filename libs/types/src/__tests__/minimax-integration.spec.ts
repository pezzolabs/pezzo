import {
  PromptService,
  Provider,
  providerDetails,
  promptProvidersMapping,
} from "../provider.types";

/**
 * Integration tests for MiniMax provider - verifies correct integration
 * with the existing provider system.
 */
describe("MiniMax Provider Integration", () => {
  it("should integrate MiniMax into the full provider ecosystem", () => {
    // All four providers should be present
    const allProviders = Object.values(Provider);
    expect(allProviders).toContain("OpenAI");
    expect(allProviders).toContain("Azure");
    expect(allProviders).toContain("Anthropic");
    expect(allProviders).toContain("MiniMax");
    expect(allProviders.length).toBe(4);
  });

  it("should have five prompt services including MiniMax", () => {
    const allServices = Object.values(PromptService);
    expect(allServices).toContain("MiniMaxChatCompletion");
    expect(allServices.length).toBe(4);
  });

  it("should have provider details for all providers", () => {
    for (const provider of Object.values(Provider)) {
      expect(providerDetails[provider]).toBeDefined();
      expect(providerDetails[provider].name).toBeTruthy();
    }
  });

  it("should have prompt provider mapping for all services", () => {
    for (const service of Object.values(PromptService)) {
      expect(promptProvidersMapping[service]).toBeDefined();
      expect(promptProvidersMapping[service].name).toBeTruthy();
      expect(promptProvidersMapping[service].provider).toBeTruthy();
    }
  });

  it("should correctly associate MiniMax service with MiniMax provider", () => {
    const minimaxMapping =
      promptProvidersMapping[PromptService.MiniMaxChatCompletion];
    expect(minimaxMapping.provider).toBe(Provider.MiniMax);
    expect(minimaxMapping.name).not.toContain("Coming Soon");
  });
});
