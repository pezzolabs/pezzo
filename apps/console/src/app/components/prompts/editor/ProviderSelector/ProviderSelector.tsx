import { Col, Form, Row, Select, Space } from "antd";
import styled from "@emotion/styled";
import { useState } from "react";
import { sortRenderedProviders } from "./providers";
import { ProviderProps } from "./types";
import { usePromptVersionEditorContext } from "../../../../lib/providers/PromptVersionEditorContext";
import { getServiceDefaultSettings } from "../ProviderSettings/providers";
import { PromptService } from "../../../../../@generated/graphql/graphql";
import { trackEvent } from "../../../../lib/utils/analytics";

const StyledSelect = styled(Select)`
  .actions {
    display: none;
  }
`;

export const ProviderSelector = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { form } = usePromptVersionEditorContext();

  const settings = Form.useWatch("settings", { form, preserve: true }) ?? {};
  const providers = sortRenderedProviders(
    Object.keys(settings) as PromptService[]
  );

  const handleSelect = (value: PromptService) => {
    const defaultSettings = getServiceDefaultSettings(value);
    form.setFieldsValue({ settings: defaultSettings });
    setOpen(false);
  };

  const renderProvider = (provider: ProviderProps) => {
    const isAvailable = provider.value === PromptService.OpenAiChatCompletion;
    return {
      disabled: !isAvailable,
      value: provider.value,
      label: (
        <div>
          <Row justify="space-between" align="middle" style={{ width: "100%" }}>
            <Col>
              <Space>
                {provider.image}
                {provider.label}
              </Space>
            </Col>
          </Row>
        </div>
      ),
    };
  };

  const onProviderSelectClick = () => {
    if (!open) {
      setOpen(true);
      trackEvent("prompt_provider_selector_open");
    }
  };

  return (
    <Form.Item name="service" style={{ marginBottom: 0 }}>
      <StyledSelect
        className="selector"
        open={open}
        onClick={onProviderSelectClick}
        onBlur={() => setOpen(false)}
        onSelect={handleSelect}
        size="large"
        style={{ width: "100%" }}
        placeholder="Select a provider"
        options={providers.map(renderProvider)}
      />
    </Form.Item>
  );
};
