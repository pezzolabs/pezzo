import { PromptService } from "pezzo/libs/types/src";
import { registerEnumType } from "@nestjs/graphql";

registerEnumType(PromptService, {
  name: "PromptService",
  description: undefined,
});

export { PromptService };
