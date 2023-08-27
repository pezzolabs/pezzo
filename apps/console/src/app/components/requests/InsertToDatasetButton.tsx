import {
  ObservabilityRequest,
  ObservabilityResponse,
  Provider,
} from "@pezzo/types";
import { Dropdown, Space, message } from "antd";
import type { MenuProps } from "antd";
import { useDatasets } from "../../graphql/hooks/queries";
import { useInsertToDatasetMutation } from "../../graphql/hooks/mutations";

interface Props {
  request: ObservabilityRequest<Provider.OpenAI>;
  response: ObservabilityResponse;
}

export const InsertToDatasetButton = ({ request, response }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { datasets } = useDatasets();
  const {
    mutate: insertToDataset,
  } = useInsertToDatasetMutation({
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Successfully added to dataset",
      });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Failed to add to dataset",
      });
    },
  });

  const dataToInsert = {
    messages: [...request.body.messages, response.body.choices[0].message],
  };

  const handleInsertToDataset = (datasetId: string) => {
    insertToDataset({
      data: {
        datasetId,
        data: dataToInsert,
      },
    });
  };

  const items: MenuProps["items"] = datasets?.map((dataset) => ({
    label: dataset.name,
    key: dataset.id,
    onClick: () => handleInsertToDataset(dataset.id),
  }));

  return (
    <>
      {contextHolder}
      <Dropdown menu={{ items }} trigger={["click"]}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>Add to Dataset</Space>
        </a>
      </Dropdown>
    </>
  );
};
