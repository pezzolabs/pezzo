import { Pezzo } from "@pezzo/client";
import { OpenAIExecutor } from "./openai/executor";

// Initialize the Pezzo client
const pezzo = new Pezzo({
  serverUrl: "http://localhost:3000",
  environment: "dev", // <-- Environment slug
  apiKey:
    "pez_b950ce9eaa308ea27c29294b625dd6914e8f395f681d7fe8bc1f609c797e4c38",
});

// Initialize the OpenAI client
const openai = new OpenAIExecutor({
  apiKey: "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",
}).setPezzoClient(pezzo);

const main = async () => {
  // Run prompt
  const { result } = await openai.run<{ name: string; lastName: string }>(
    "RecommendProduct",
    {
      name: "Itay",
      lastName: "Elgazar",
    },
    {
      autoParseJSON: true,
    }
  );
};

main();
