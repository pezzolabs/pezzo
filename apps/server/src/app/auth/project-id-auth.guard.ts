import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { PinoLogger } from "@pezzo/logger";
import { ProjectsService } from "../identity/projects.service";

@Injectable({ scope: Scope.REQUEST })
export class ProjectIdAuthGuard implements CanActivate {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly logger: PinoLogger
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.headers["x-pezzo-project-id"]) {
      throw new UnauthorizedException("Invalid Pezzo Project ID");
    }

    return this.authorizeProjectId(req);
  }

  private async authorizeProjectId(req) {
    const projectId = req.headers["x-pezzo-project-id"];
    const project = await this.projectsService.getProjectById(projectId);

    if (!project) {
      throw new UnauthorizedException("Invalid Pezzo Project ID");
    }

    req.projectId = projectId;

    this.logger.assign({
      projectId,
    });

    return true;
  }
}
