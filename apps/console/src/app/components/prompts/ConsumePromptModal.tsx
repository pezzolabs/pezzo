import { Modal, Typography } from "antd";
import { useCurrentPrompt } from "../../lib/providers/CurrentPromptContext";
import { Highlight, themes } from "prism-react-renderer";

interface Props {
  open: boolean;
  onClose: () => void;
  variables: Record<string, string>;
}

export const ConsumePromptModal = ({ open, onClose, variables }: Props) => {
  const { prompt, integration } = useCurrentPrompt();

  let codeBlock = `import { Pezzo } from "@pezzo/client";
import { AI21Executor } from "@pezzo/integrations/a21";  

// Initialize the Pezzo client
const pezzo = new Pezzo({
  pezzoServerURL: "http://localhost:3000",
  environment: "development",
});

// Initialize the AI21 client
const ai21 = new AI21Executor(pezzo, { apiKey: '...' });

// Run prompt
const { result } = await ai21.run('${prompt.name}', {\n`;

  Object.entries(variables).forEach(([key, value]) => {
    codeBlock += `  ${key}: '...'\n`;
  });

  codeBlock += "});";

  return (
    <Modal
      width={800}
      title={`How to consume the ${prompt.name} prompt`}
      open={open}
      onCancel={onClose}
      footer={false}
    >
      <Typography.Title level={2} style={{ fontSize: 20, marginTop: 24 }}>
        Step 1: Install the Pezzo client
      </Typography.Title>
      <pre style={{ background: "#000", padding: 14, borderRadius: 6 }}>
        npm install @pezzo/client
      </pre>

      <Typography.Title level={2} style={{ fontSize: 20, marginTop: 24 }}>
        Step 2: Consume the client to run your prompt
      </Typography.Title>
      <Highlight theme={themes.vsDark} code={codeBlock} language="ts">
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
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
