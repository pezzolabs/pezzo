import { Get, Controller } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { version } from "@pezzo/common";

@ApiTags("Health")
@Controller("healthz")
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Performs a health check" })
  @ApiResponse({
    status: 200,
    description: "Returns the health status and current version",
  })
  healthz() {
    return {
      status: "OK",
      version,
    };
  }
}
