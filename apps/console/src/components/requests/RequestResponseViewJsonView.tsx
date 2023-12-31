import { Card } from "@pezzo/ui";
import OpenAI from "openai";

interface Props {
  requestBody: OpenAI.ChatCompletionCreateParams;
  responseBody: OpenAI.ChatCompletion;
}

export const RequestResponseViewJsonView = ({ requestBody, responseBody }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-4 font-semibold">Request</p>
        <Card className="bg-background p-2">
          <pre className="overflow-y-auto whitespace-break-spaces break-words">
            {JSON.stringify(requestBody, null, 2)}
          </pre>
        </Card>
      </div>
      <div>
        <p className="mb-4 font-semibold">Response</p>
        <Card className="bg-background p-2">
          <pre className="overflow-y-auto whitespace-break-spaces break-words">
            {JSON.stringify(responseBody, null, 2)}
          </pre>
        </Card>
      </div>
    </div>
  );
};
