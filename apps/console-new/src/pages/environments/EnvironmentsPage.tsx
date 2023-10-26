import { Button, Card } from "@pezzo/ui";
import { CreateEnvironmentModal } from "~/components/environments/CreateEnvironmentModal";
import { useState } from "react";
import { useEnvironments } from "~/lib/hooks/useEnvironments";
import { EnvironmentsQuery } from "~/@generated/graphql/graphql";
import { trackEvent } from "~/lib/utils/analytics";
import { usePageTitle } from "~/lib/hooks/usePageTitle";
import { PlusIcon, TrashIcon } from "lucide-react";
import { GenericDestructiveConfirmationModal } from "~/components/common/GenericDestructiveConfirmationModal";
import { useDeleteEnvironmentMutation } from "~/graphql/hooks/mutations";

type Environment = EnvironmentsQuery["environments"][0];

export const EnvironmentsPage = () => {
  usePageTitle("Environments");
  const { environments, isLoading } = useEnvironments();
  const [isCreateEnvironmentModalOpen, setIsCreateEnvironmentModalOpen] =
    useState(false);
  const [environmentToDelete, setEnvironmentToDelete] =
    useState<Environment | null>(null);
  const { mutate: deleteEnvironment, error: deleteEnvironmentError } =
    useDeleteEnvironmentMutation();

  const handleCreateEnvironmentClick = () => {
    setIsCreateEnvironmentModalOpen(true);
    trackEvent("environment_create_modal_opened");
  };

  const handleDeleteEnvironmentClick = (environment: Environment) => {
    setEnvironmentToDelete(environment);
    trackEvent("environment_delete_modal_opened", { name: environment.name });
  };

  const handleDeleteEnvironmentConfirm = (environmentId: string) => {
    deleteEnvironment(
      { id: environmentId },
      {
        onSuccess: () => {
          trackEvent("environment_delete_confirmed", {
            name: environmentToDelete?.name,
          });
          setEnvironmentToDelete(null);
        },
      }
    );
  };

  return (
    <>
      <GenericDestructiveConfirmationModal
        title="Delete Environment"
        description="Are you sure you want to delete this environment? All associated data will be lost."
        open={!!environmentToDelete}
        onConfirm={() => handleDeleteEnvironmentConfirm(environmentToDelete.id)}
        onCancel={() => setEnvironmentToDelete(null)}
        error={deleteEnvironmentError}
      />

      <CreateEnvironmentModal
        open={isCreateEnvironmentModalOpen}
        onClose={() => setIsCreateEnvironmentModalOpen(false)}
        onCreated={() => setIsCreateEnvironmentModalOpen(false)}
      />

      <div className="flex gap-4">
        <h1 className="mb-4 flex-1 text-3xl font-semibold">Environments</h1>
        <div className="mb-4">
          <Button onClick={handleCreateEnvironmentClick}>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Environment
          </Button>
        </div>
      </div>

      <div className="max-w-[600px]">
        {environments &&
          environments.map((environment) => (
            <Card className="mb-4 p-4" key={environment.id}>
              <div className="flex items-center gap-4">
                <div className="flex-1">{environment.name}</div>
                <div>
                  <Button
                    onClick={() => handleDeleteEnvironmentClick(environment)}
                    size="icon"
                    variant="destructiveOutline"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </>
  );
};
