import {
  ObservabilityRequest,
  ObservabilityResponse,
  Provider,
} from "@pezzo/types";
import { Card } from "@pezzo/ui";

interface Props {
  request: ObservabilityRequest<Provider.OpenAI>;
  response: ObservabilityResponse<Provider.OpenAI>;
}

export const RequestResponseViewJsonView = ({ request, response }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-4 font-semibold">Request</p>
        <Card className="bg-background p-2">
          <pre className="overflow-y-auto whitespace-break-spaces break-words">
            {JSON.stringify(request.body, null, 2)}
          </pre>
        </Card>
      </div>
      <div>
        <p className="mb-4 font-semibold">Response</p>
        <Card className="bg-background p-2">
          <pre className="overflow-y-auto whitespace-break-spaces break-words">
            {JSON.stringify(response.body, null, 2)}
          </pre>
        </Card>
      </div>
    </div>
  );
};
