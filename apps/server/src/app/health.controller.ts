import { Get, Controller } from "@nestjs/common";
import { version } from "@pezzo/common";
@Controller("healthz")
export class HealthController {
  @Get()
  healthz() {
    return {
      status: "OK",
      version,
    };
  }
}
