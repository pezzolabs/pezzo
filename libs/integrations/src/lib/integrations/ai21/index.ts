import { IntegrationDefinition } from "../types";
import { Executor } from "./Executor";
import { defaultSettings, settingsSchema } from "./settings";
export * from "./types";

const integration: IntegrationDefinition = {
  id: "ai21",
  name: "AI21",
  provider: "AI21",
  iconBase64:
    "data:image/png;base64,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",
  Executor,
  settingsSchema,
  defaultSettings,
  consumeInstructionsFn: (
    promptName: string,
    variables: Record<string, string>,
    pezzoApiKey: string
  ) => {
    let codeBlock = "";

    codeBlock += `import { Pezzo } from "@pezzo/client";
import { AI21Executor } from "@pezzo/integrations/ai21";  

// Initialize the Pezzo client
const pezzo = new Pezzo({
  pezzoServerURL: "http://localhost:3000",
  environment: "development",
  apiKey: "${pezzoApiKey}",
});

// Initialize the AI21 client
const ai21 = new AI21Executor(pezzo, { apiKey: "..." });

// Run prompt
const { result } = await ai21.run('${promptName}', {\n`;

    Object.entries(variables).forEach(([key, value]) => {
      codeBlock += `  ${key}: '...'\n`;
    });

    codeBlock += "});";

    return codeBlock;
  },
};

export default integration;
