import { Modal, Typography } from "antd";
import { Highlight, themes } from "prism-react-renderer";

export const JavascriptIntegrationModal = ({
  onCancel,
  projectId,
}: {
  onCancel: () => void;
  projectId: string;
}) => {
  return (
    <Modal
      title="Integrate Pezzo With Your Server"
      width={800}
      open={true}
      footer={null}
      onCancel={onCancel}
    >
      Pezzo comes with a JavaScript SDK that you can use to integrate with your
      server. <br />
      <br />
      <Typography.Title level={4}>Installation</Typography.Title>
      <Typography.Paragraph>
        Install the SDK using npm or yarn.
      </Typography.Paragraph>
      <pre>
        <code>
          {`npm install @pezzo/client
# or
yarn add @pezzo/client`}
        </code>
      </pre>
      <Typography.Title level={4} style={{ marginTop: 48 }}>
        Usage with OpenAI
      </Typography.Title>
      <Typography.Paragraph>
        Import the SDK and initialize it with your project ID.
      </Typography.Paragraph>
      <Highlight
        theme={themes.vsDark}
        code={`import { Pezzo } from "@pezzo/client";
const pezzo = new Pezzo("${projectId}");

const openai = pezzo.openai("YOUR_API_KEY");
const response = await openai.createChatCompletion();`}
        language="ts"
      >
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
