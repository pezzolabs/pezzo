import { PromptService } from "@pezzo/types";
import { registerEnumType } from "@nestjs/graphql";

registerEnumType(PromptService, {
  name: "PromptService",
  description: undefined,
});

export { PromptService };
