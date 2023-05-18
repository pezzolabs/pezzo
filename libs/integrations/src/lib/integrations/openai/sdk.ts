import { Configuration, OpenAIApi } from "openai";

export const initSdk = (apiKey: string) => {
  const configuration = new Configuration({
    apiKey,
  });

  return new OpenAIApi(configuration);
};
