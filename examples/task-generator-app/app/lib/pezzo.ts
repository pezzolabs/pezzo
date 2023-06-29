import { Pezzo, PezzoOpenAIApi } from "@pezzo/client";
import { Configuration } from "openai";

// Initialize the Pezzo client
export const pezzo = new Pezzo({
  serverUrl: process.env.PEZZO_SERVER_URL || "https://api.pezzo.ai",
  apiKey: process.env.PEZZO_API_KEY as string,
  projectId: process.env.PEZZO_PROJECT_ID as string,
  environment: "Production",
});

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize the Pezzo OpenAI API
export const openai = new PezzoOpenAIApi(pezzo, configuration);

