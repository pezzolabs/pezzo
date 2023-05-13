import { Get, Controller, UseGuards } from "@nestjs/common";
import { version } from "@pezzo/common";
import { AuthGuard } from "./auth/auth.guard";

@Controller("healthz")
export class HealthController {
  @Get()
  healthz() {
    return {
      status: "OK",
      version,
    };
  }

  @Get("/test")
  @UseGuards(new AuthGuard())
  test() {
    return { test: "OK" };
  }
}
