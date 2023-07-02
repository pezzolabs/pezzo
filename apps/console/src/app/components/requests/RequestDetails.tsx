import {
  ObservabilityReportMetadata,
  ObservabilityRequest,
  ObservabilityResponse,
  ProviderType,
  ObservabilityReportProperties,
} from "@pezzo/types";

interface Props {
  id: string;
  request: ObservabilityRequest;
  response: ObservabilityResponse;
  provider: ProviderType;
  metadata: ObservabilityReportMetadata;
  properties: ObservabilityReportProperties;
  calculated: Record<string, any>;
}

export const RequestDetails = (props: Props) => {
  if (props.provider !== ProviderType.OpenAi) {
    return <div>Something went wrong</div>;
  }

  const request = props.request as ObservabilityRequest<ProviderType.OpenAi>;
  const response = props.response as ObservabilityResponse<ProviderType.OpenAi>;

  return (
    <div>
      {props.request.timestamp}
      <div>{response.body.choices[0]?.message.content}</div>
    </div>
  );
};
