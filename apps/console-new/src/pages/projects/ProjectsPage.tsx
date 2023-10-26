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
import { DeleteProjectModal } from "~/components/projects/DeleteProjectModal";
import { RenameProjectModal } from "~/components/projects/RenameProjectModal";
import { GetProjectsQuery } from "~/@generated/graphql/graphql";
import clsx from "clsx";

type Project = GetProjectsQuery["projects"][0];

export const ProjectsPage = () => {
  const { projects, isLoading } = useGetProjects();
  const [isCreateNewProjectModalOpen, setIsCreateNewProjectModalOpen] =
    useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projectToRename, setProjectToRename] = useState<Project | null>(null);
  const navigate = useNavigate();
  usePageTitle("Projects");

  useEffect(() => {
    if (isLoading) return;
    if (!projects?.length) navigate("/onboarding");
  }, [projects, isLoading, navigate]);

  const onOpenCreateNewProjectModal = () => {
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
      className={clsx(baseCardClassName, "ring-primary hover:ring-2")}
      onClick={() => handleProjectClick(project.id)}
    >
      <div className="flex items-start">
        <div className="flex-1">
          <HomeIcon className="mb-2 h-8 w-8 text-primary" />
          <div className="text-lg font-medium">{project.name}</div>
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
      <DeleteProjectModal
        projectToDelete={projectToDelete}
        onClose={() => setProjectToDelete(null)}
      />
      <RenameProjectModal
        projectToRename={projectToRename}
        onClose={() => setProjectToRename(null)}
      />

      <CreateNewProjectModal
        open={isCreateNewProjectModalOpen}
        onClose={() => setIsCreateNewProjectModalOpen(false)}
      />

      <div className="flex gap-4">
        <h1 className="mb-4 flex-1 text-3xl font-semibold">Projects</h1>
        <div className="mb-4">
          <Button onClick={onOpenCreateNewProjectModal}>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-4 gap-y-4">
        {projects?.map((project) => renderProject(project))}
        {/* New Project Button */}
        <Card
          className={clsx(
            baseCardClassName,
            "flex flex-col items-center justify-center border-2 border-dashed opacity-60 hover:opacity-100"
          )}
          onClick={onOpenCreateNewProjectModal}
        >
          <PlusIcon className="mb-1 h-7 w-7" />
          New Project
        </Card>
      </div>
    </>
  );
};
