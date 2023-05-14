import { Controller, Get } from "@nestjs/common";
import { SupertokensService } from "./supertokens.service";

@Controller("/auth/methods")
export class AuthMethodsController {
  constructor(private supertokensService: SupertokensService) {}

  @Get()
  getAuthMethods() {
    return {};
  }
}
