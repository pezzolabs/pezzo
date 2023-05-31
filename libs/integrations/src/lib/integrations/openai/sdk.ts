import { Configuration, ConfigurationParameters, OpenAIApi } from "openai";

export const initSdk = (configurationParameters: ConfigurationParameters) => {
  const configuration = new Configuration(configurationParameters);
  return new OpenAIApi(configuration);
};
