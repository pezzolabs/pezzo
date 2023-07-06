import {
  ObservabilityRequest,
  ObservabilityResponse,
  ProviderType,
} from "@pezzo/types";
import { Space, Typography, Card } from "antd";

interface Props {
  request: ObservabilityRequest<ProviderType.OpenAI>;
  response: ObservabilityResponse<ProviderType.OpenAI>;
}

export const RequestResponseViewJsonView = ({ request, response }: Props) => {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Typography.Text strong>Request</Typography.Text>
      <Card>
        <pre>{JSON.stringify(request.body, null, 2)}</pre>
      </Card>
      <Typography.Text strong>Response</Typography.Text>
      <Card>
        <pre>{JSON.stringify(response.body, null, 2)}</pre>
      </Card>
    </Space>
  );
};
