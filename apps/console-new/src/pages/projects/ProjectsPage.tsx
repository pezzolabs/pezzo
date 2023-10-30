import { useNavigate } from "react-router-dom";
import { useGetProjects } from "~/graphql/hooks/queries";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@pezzo/ui";
import { trackEvent } from "~/lib/utils/analytics";
import { usePageTitle } from "~/lib/hooks/usePageTitle";
import {
  HomeIcon,
  MoreVertical,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { CreateNewProjectModal } from "~/components/projects/CreateNewProjectModal";
import { RenameProjectModal } from "~/components/projects/RenameProjectModal";
import { GetProjectsQuery } from "~/@generated/graphql/graphql";
import clsx from "clsx";
import { useDeleteProjectMutation } from "~/graphql/hooks/mutations";
import { GenericDestructiveConfirmationModal } from "~/components/common/GenericDestructiveConfirmationModal";

type Project = GetProjectsQuery["projects"][0];

export const ProjectsPage = () => {
  const { projects, isLoading } = useGetProjects();
  const [isCreateNewProjectModalOpen, setIsCreateNewProjectModalOpen] =
    useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projectToRename, setProjectToRename] = useState<Project | null>(null);
  const navigate = useNavigate();
  usePageTitle("Projects");

  const { mutate: deleteProject, error } = useDeleteProjectMutation();

  const handleDeleteProject = (projectId: string) => {
    deleteProject(
      { id: projectToDelete.id },
      {
        onSuccess: () => {
          setProjectToDelete(null);
        },
      }
    );
    trackEvent("project_delete_confirmed", {
      projectId: projectToDelete?.id,
    });
  };

  useEffect(() => {
    if (isLoading) return;
    if (!projects?.length) navigate("/onboarding");
  }, [projects, isLoading, navigate]);

  const handleCreateNewProjectClick = () => {
    setIsCreateNewProjectModalOpen(true);
    trackEvent("project_create_modal_opened");
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
    trackEvent("project_nav_clicked", { projectId });
  };

  const handleRenameClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    trackEvent("project_rename_modal_opened", { projectId: project.id });
    setProjectToRename(project);
  };

  const handleDeleteClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    trackEvent("project_delete_modal_opened", { projectId: project.id });
    setProjectToDelete(project);
  };

  const baseCardClassName = "col-span-3 cursor-pointer p-6";

  const renderProject = (project: Project) => (
    <Card
      key={project.id}
      className={clsx(baseCardClassName, "ring-primary hover:ring-2")}
      onClick={() => handleProjectClick(project.id)}
    >
      <div className="flex items-start">
        <div className="flex-1">
          <HomeIcon className="mb-2 h-6 w-6 text-primary" />
          <div className="text-lg font-heading font-medium">{project.name}</div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="h-5 w-5 text-black/40" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={(e) => handleRenameClick(e, project)}>
              <PencilIcon className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => handleDeleteClick(e, project)}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );

  return (
    <>
      <GenericDestructiveConfirmationModal
        open={!!projectToDelete}
        title="Delete Project"
        description={`Are you sure you want to delete the "${projectToDelete?.name}" project? All associated data will be lost.`}
        onCancel={() => setProjectToDelete(null)}
        onConfirm={() => handleDeleteProject(projectToDelete?.id)}
        confirmText="Delete"
      />

      <RenameProjectModal
        projectToRename={projectToRename}
        onClose={() => setProjectToRename(null)}
      />

      <CreateNewProjectModal
        open={isCreateNewProjectModalOpen}
        onClose={() => setIsCreateNewProjectModalOpen(false)}
      />

      <div className="mb-6 border-b bg-white">
        <div className="container flex h-24 items-center justify-between">
          <h1>Projects</h1>
          <Button size="lg" onClick={handleCreateNewProjectClick}>
            <PlusIcon className="mr-2 h-5 w-5" />
            New Project
          </Button>
        </div>
      </div>

      <div className="container">
        <div className="mb-4 flex justify-end gap-4">
          <div></div>
        </div>
        <div className="grid grid-cols-12 gap-x-4 gap-y-4">
          {projects?.map((project) => renderProject(project))}
          <Card
            className={clsx(
              baseCardClassName,
              "flex flex-col items-center justify-center border-2 border-dashed opacity-60 hover:opacity-100"
            )}
            onClick={handleCreateNewProjectClick}
          >
            <PlusIcon className="mb-1 h-7 w-7" />
            New Project
          </Card>
        </div>
      </div>
    </>
  );
};
