import { ForbiddenException } from "@nestjs/common";
import { ProjectsResolver } from "./projects.resolver";
import { RequestUser } from "./users.types";

jest.mock("./identity.utils", () => ({
  isOrgAdminOrThrow: jest.fn(),
  isOrgMemberOrThrow: jest.fn(),
}));

jest.mock("@pezzo/common", () => ({
  slugify: jest.fn(),
}));

import { isOrgMemberOrThrow } from "./identity.utils";
import { slugify } from "@pezzo/common";

describe("ProjectsResolver - createProject authorization", () => {
  const projectsService = {
    getProjectBySlug: jest.fn(),
    createProject: jest.fn(),
  } as any;

  const logger = {
    assign: jest.fn().mockReturnThis(),
    info: jest.fn(),
    error: jest.fn(),
  } as any;

  const analytics = {
    trackEvent: jest.fn(),
  } as any;

  let resolver: ProjectsResolver;

  const user = {
    userId: "user-1",
    orgMemberships: [
      {
        organizationId: "org-1",
        role: "Member",
      },
    ],
  } as unknown as RequestUser;

  const input = {
    name: "My Test Project",
    organizationId: "org-1",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resolver = new ProjectsResolver(projectsService, logger, analytics);
    (isOrgMemberOrThrow as jest.Mock).mockImplementation(() => undefined);
    (slugify as jest.Mock).mockReturnValue("my-test-project");
    projectsService.getProjectBySlug.mockResolvedValue(null);
    projectsService.createProject.mockResolvedValue({
      id: "project-1",
      name: input.name,
      slug: "my-test-project",
      organizationId: input.organizationId,
    });
  });

  it("enforces org membership check with current user and organizationId", async () => {
    await resolver.createProject(user, input as any);

    expect(isOrgMemberOrThrow).toHaveBeenCalledTimes(1);
    expect(isOrgMemberOrThrow).toHaveBeenCalledWith(user, input.organizationId);
  });

  it("blocks unauthorized users before slug generation and service calls", async () => {
    (isOrgMemberOrThrow as jest.Mock).mockImplementation(() => {
      throw new ForbiddenException("Forbidden resource");
    });

    await expect(resolver.createProject(user, input as any)).rejects.toThrow(
      ForbiddenException
    );

    expect(slugify).not.toHaveBeenCalled();
    expect(projectsService.getProjectBySlug).not.toHaveBeenCalled();
    expect(projectsService.createProject).not.toHaveBeenCalled();
    expect(analytics.trackEvent).not.toHaveBeenCalled();
  });

  it("keeps existing create flow for authorized users", async () => {
    const created = await resolver.createProject(user, input as any);

    expect(slugify).toHaveBeenCalledWith(input.name);
    expect(projectsService.getProjectBySlug).toHaveBeenCalledWith(
      "my-test-project",
      input.organizationId
    );
    expect(projectsService.createProject).toHaveBeenCalledWith(
      input.name,
      "my-test-project",
      input.organizationId
    );
    expect(analytics.trackEvent).toHaveBeenCalledWith("project_created", {
      projectId: "project-1",
      name: input.name,
    });
    expect(created).toEqual({
      id: "project-1",
      name: input.name,
      slug: "my-test-project",
      organizationId: input.organizationId,
    });
  });
});
