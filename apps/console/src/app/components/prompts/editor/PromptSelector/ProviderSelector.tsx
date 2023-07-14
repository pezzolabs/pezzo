import { Button, Col, Form, Row, Select, Space } from "antd";
import styled from "@emotion/styled";
import { useState } from "react";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { sortRenderedProviders } from "./providers";
import { ProviderProps } from "./types";
import { ProviderSettingsKeys } from "@pezzo/types";
import { usePromptVersionEditorContext } from "../../../../lib/providers/PromptVersionEditorContext";

const StyledSelect = styled(Select)`
  .actions {
    display: none;
  }
`;

interface Props {
  selectedProvider: ProviderSettingsKeys;
  onSelect: (value: ProviderSettingsKeys) => void;
  onAdd: (value: ProviderSettingsKeys) => void;
}

export const ProviderSelector = ({
  selectedProvider,
  onSelect,
  onAdd,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { form } = usePromptVersionEditorContext();

  const settings = Form.useWatch("settings", { form, preserve: true }) ?? {};
  const providers = sortRenderedProviders(
    Object.keys(settings) as ProviderSettingsKeys[]
  );

  const handleDelete = (
    event: React.MouseEvent<HTMLElement>,
    provider: ProviderProps
  ) => {
    event.stopPropagation();
    const newSettings = { ...settings };
    delete newSettings[provider.value];
    form.setFieldValue("settings", newSettings);

    if (selectedProvider === provider.value) {
      onSelect(null);
    }
  };

  const handleAdd = (
    event: React.MouseEvent<HTMLElement>,
    provider: ProviderProps
  ) => {
    event.stopPropagation();
    onAdd(provider.value);
    onSelect(provider.value);
    setOpen(false);
  };

  const handleSelect = (value: ProviderProps["value"]) => {
    onSelect(value);
    setOpen(false);
  };

  const renderProvider = (provider: ProviderProps) => {
    const isManaged = Object.keys(settings).includes(provider.value);

    return {
      value: provider.value,
      disabled: !isManaged,
      label: (
        <div>
          <Row justify="space-between" align="middle" style={{ width: "100%" }}>
            <Col style={{ maxWidth: "80%" }}>
              <Space>
                {provider.image}
                {provider.label}
              </Space>
            </Col>
            <Col className="actions">
              {isManaged ? (
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={(e: React.MouseEvent<HTMLElement>) =>
                    handleDelete(e, provider)
                  }
                />
              ) : (
                <Button
                  type="text"
                  icon={<PlusCircleOutlined />}
                  onClick={(e: React.MouseEvent<HTMLElement>) =>
                    handleAdd(e, provider)
                  }
                />
              )}
            </Col>
          </Row>
        </div>
      ),
    };
  };

  return (
    <StyledSelect
      className="selector"
      open={open}
      onClick={() => !open && setOpen(true)}
      onBlur={() => setOpen(false)}
      onSelect={handleSelect}
      size="large"
      style={{ width: "100%" }}
      placeholder="Select a provider"
      value={selectedProvider}
      options={providers.map(renderProvider)}
    />
  );
};
