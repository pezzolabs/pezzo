import { Button, Card } from "@pezzo/ui";
import { CreateEnvironmentModal } from "~/components/environments/CreateEnvironmentModal";
import { DeleteEnvironmentModal } from "~/components/environments/DeleteEnvironmentModal";
import { useState } from "react";
import { useEnvironments } from "~/lib/hooks/useEnvironments";
import { EnvironmentsQuery } from "~/@generated/graphql/graphql";
import { trackEvent } from "~/lib/utils/analytics";
import { usePageTitle } from "~/lib/hooks/usePageTitle";
import { PlusIcon, TrashIcon } from "lucide-react";

type Environment = EnvironmentsQuery["environments"][0];

export const EnvironmentsPage = () => {
  usePageTitle("Environments");
  const { environments, isLoading } = useEnvironments();
  const [isCreateEnvironmentModalOpen, setIsCreateEnvironmentModalOpen] =
    useState(false);
  const [environmentToDelete, setEnvironmentToDelete] =
    useState<Environment | null>(null);

  const onCreateEnvironmentModalOpen = () => {
    setIsCreateEnvironmentModalOpen(true);
    trackEvent("environment_create_modal_opened");
  };

  const onDeleteEnvironmentModalOpen = (environment: Environment) => () => {
    setEnvironmentToDelete(environment);
    trackEvent("environment_delete_modal_opened", { name: environment.name });
  };

  return (
    <>
      <CreateEnvironmentModal
        open={isCreateEnvironmentModalOpen}
        onClose={() => setIsCreateEnvironmentModalOpen(false)}
        onCreated={() => setIsCreateEnvironmentModalOpen(false)}
      />

      <DeleteEnvironmentModal
        environmentToDelete={environmentToDelete}
        onClose={() => setEnvironmentToDelete(null)}
        onDelete={() => setEnvironmentToDelete(null)}
      />

      <div className="flex gap-4">
        <h1 className="mb-4 text-3xl font-semibold flex-1">Environments</h1>
        <div className="mb-4">
          <Button onClick={onCreateEnvironmentModalOpen}>
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
                    onClick={onDeleteEnvironmentModalOpen(environment)}
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
