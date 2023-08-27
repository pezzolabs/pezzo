import { useParams } from "react-router-dom";
import {
  useFineTunedModel,
  useFineTunedModelVariants,
} from "../../graphql/hooks/queries";
import { CreateVariantDialog } from "./CreateVariantDialog";
import { useState } from "react";
import { Button, Card, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export const FineTunedModelPage = () => {
  const { modelId } = useParams();
  const { model, isError, isLoading } = useFineTunedModel(modelId);
  const { variants } = useFineTunedModelVariants(modelId);

  const [isCreateVariantDialogOpen, setIsCreateVariantDialogOpen] =
    useState(false);

  return (
    model &&
    variants && (
      <>
        <h1>Model: {model.name}</h1>

        <h2>Variants</h2>

        <Button
          icon={<PlusOutlined />}
          onClick={() => setIsCreateVariantDialogOpen(true)}
        >
          New Variant
        </Button>

        <CreateVariantDialog
          open={isCreateVariantDialogOpen}
          onClose={() => setIsCreateVariantDialogOpen(false)}
          onCreated={() => setIsCreateVariantDialogOpen(false)}
        />

          {variants?.length > 0 ? (
            variants.map((variant) => (
              <Card style={{ marginTop: 12 }}>
                <h3>{variant.slug}</h3>
                <Tag>{variant.status}</Tag>

                {variant.status === "Completed" && (
                  <pre style={{ marginTop: 12 }}>
                    {JSON.stringify(JSON.parse(variant.enrichment), null, 2)}
                  </pre>
                )}
              </Card>
            ))
          ) : (
            <span>No variants</span>
          )}
      </>
    )
  );
};
