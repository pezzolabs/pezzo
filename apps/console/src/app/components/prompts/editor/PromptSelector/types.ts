import { ProviderSettingsKeys } from "@pezzo/types";

export interface ProviderProps {
  image: React.ReactNode;
  value: ProviderSettingsKeys;
  label: string;
}