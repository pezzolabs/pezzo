import { Button, Col, Form, Row, Select, Space } from "antd";
import styled from "@emotion/styled";
import { useState } from "react";
import { sortRenderedProviders } from "./providers";
import { ProviderProps } from "./types";
import { PromptService } from "@pezzo/types";
import { usePromptVersionEditorContext } from "../../../../lib/providers/PromptVersionEditorContext";

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

  const handleSelect = (value: ProviderProps["value"]) => {
    setOpen(false);
  };

  const renderProvider = (provider: ProviderProps) => {
    const isConfigured = true; // TODO

    return {
      value: provider.value,
      disabled: !isConfigured,
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
              {/* {isManaged ? (
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
              )} */}
            </Col>
          </Row>
        </div>
      ),
    };
  };

  return (
    <Form.Item name="service" style={{ marginBottom: 0 }}>
      <StyledSelect
        className="selector"
        open={open}
        onClick={() => !open && setOpen(true)}
        onBlur={() => setOpen(false)}
        onSelect={handleSelect}
        size="large"
        style={{ width: "100%" }}
        placeholder="Select a provider"
        // value={selectedProvider}
        options={providers.map(renderProvider)}
      />
    </Form.Item>
  );
};
