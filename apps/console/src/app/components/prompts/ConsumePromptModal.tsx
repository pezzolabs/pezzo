import { Modal, Typography } from "antd";
import { useCurrentPrompt } from "../../lib/providers/CurrentPromptContext";
import { Highlight, themes } from "prism-react-renderer";
import { getIntegration } from "@pezzo/integrations";
import { useApiKeys } from "../../lib/hooks/queries";

interface Props {
  open: boolean;
  onClose: () => void;
  variables: Record<string, string>;
}

export const ConsumePromptModal = ({ open, onClose, variables }: Props) => {
  const { prompt, integration } = useCurrentPrompt();
  const { data: pezzoApiKeysData } = useApiKeys();

  if (!pezzoApiKeysData) {
    return null;
  }

  const codeBlock = integration.consumeInstructionsFn(
    prompt.name,
    variables,
    pezzoApiKeysData.currentApiKey.id
  );

  return (
    <Modal
      width={800}
      title={`How to consume the ${prompt.name} prompt`}
      open={open}
      onCancel={onClose}
      footer={false}
    >
      <Typography.Title level={2} style={{ fontSize: 20, marginTop: 24 }}>
        Step 1: Install the Pezzo client and Pezzo integrations
      </Typography.Title>
      <pre
        style={{
          background: "#000",
          padding: 14,
          borderRadius: 6,
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      >
        npm install @pezzo/client
        <br />
        npm install @pezzo/integrations
      </pre>

      <Typography.Title level={2} style={{ fontSize: 20, marginTop: 24 }}>
        Step 2: Consume the client to run your prompt
      </Typography.Title>
      <Highlight theme={themes.vsDark} code={codeBlock} language="ts">
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            style={{
              ...style,
              background: "#000",
              padding: 14,
              borderRadius: 6,
            }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </Modal>
  );
};
