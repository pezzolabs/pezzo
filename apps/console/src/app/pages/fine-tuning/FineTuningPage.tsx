import { useState } from "react";
import { useDatasets, useFineTunedModels } from "../../graphql/hooks/queries";
import { CreateFineTunedModelDialog } from "./CreateFineTunedModelDIalog";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { CreateDatasetDialog } from "./CreateDatasetDialog";

export const FineTuningPage = () => {
  const { fineTunedModels } = useFineTunedModels();
  const { datasets } = useDatasets();
  const [createModelDialogOpen, setCreateModelDialogOpen] = useState(false);
  const [createDatasetDialogOpen, setCreateDatasetDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleModelCreated = () => {
    setCreateModelDialogOpen(false);
  };

  const handleDatasetCreated = () => {
    setCreateDatasetDialogOpen(false);
  };

  return (
    <>
      <CreateFineTunedModelDialog
        open={createModelDialogOpen}
        onClose={() => setCreateModelDialogOpen(false)}
        onCreated={handleModelCreated}
      />

      <CreateDatasetDialog
        open={createDatasetDialogOpen}
        onClose={() => setCreateDatasetDialogOpen(false)}
        onCreated={handleDatasetCreated}
      />

      <h1>Fine Tuning</h1>

      <h2>Datasets</h2>

      <Button
        icon={<PlusOutlined />}
        onClick={() => setCreateDatasetDialogOpen(true)}
      >
        New Dataset
      </Button>

      {(datasets?.length > 0 && (
        <ul>
          {datasets.map((dataset) => (
            <li
              onClick={() =>
                navigate(
                  `/projects/${dataset.projectId}/datasets/${dataset.id}`
                )
              }
            >
              {dataset.name}
            </li>
          ))}
        </ul>
      )) || <p>You don't have any dataset.</p>}

      <h2>Fine Tuned Models</h2>

      <Button
        icon={<PlusOutlined />}
        onClick={() => setCreateModelDialogOpen(true)}
      >
        New Model
      </Button>

      {(fineTunedModels?.length > 0 && (
        <ul>
          {fineTunedModels.map((model) => (
            <li
              onClick={() =>
                navigate(`/projects/${model.projectId}/fine-tuning/${model.id}`)
              }
            >
              {model.name}
            </li>
          ))}
        </ul>
      )) || <p>You don't have any fine-tuned models.</p>}
    </>
  );
};
