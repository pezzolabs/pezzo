import { Select, Typography } from "antd";
import { integrations } from "@pezzo/integrations";
import styled from "@emotion/styled";

const Icon = styled.img`
  border-radius: 2px;
  height: 100%;
`;

const SelectItem = styled.div`
  display: flex;
  align-items: center;
  height: 28px;
  position: relative;
  padding-top: 4px;
  padding-bottom: 4px;
`;

interface Props {
  onChange: (value: string) => void;
}

const integrationsArray = Object.values(integrations);

export const PromptIntegrationSelector = ({ onChange }: Props) => {
  return (
    <Select
      defaultValue={integrationsArray[0].id}
      onChange={onChange}
      optionLabelProp="label" // https://github.com/ant-design/ant-design/issues/40205#issuecomment-1381281740
      options={integrationsArray.map((integration) => ({
        label: (
          <SelectItem>
            <Icon src={integration.iconBase64} />
            <Typography.Text style={{ display: "inline-block", marginLeft: 6 }}>
              {integration.name}
            </Typography.Text>
          </SelectItem>
        ),
        value: integration.id,
      }))}
    />
  );
};
