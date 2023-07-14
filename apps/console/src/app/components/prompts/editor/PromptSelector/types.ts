export enum ProviderSettingsKeys {
  OPENAI_CHAT_COMPLETION = "openai_chatCompletion",
  AZURE_OPENAI_CHAT_COMPLETION = "azure_openai_chatCompletion"
}

export interface ProviderProps {
  image: React.ReactNode;
  value: ProviderSettingsKeys;
  label: string;
}