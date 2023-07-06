import { Button, Typography } from "antd";
import { Highlight, themes } from "prism-react-renderer";
import { useCurrentProject } from "../../../lib/hooks/useCurrentProject";
import styled from "@emotion/styled";
import {
  Usage,
  useGettingStartedWizard,
} from "../../../lib/providers/GettingStartedWizardProvider";

const StyledPre = styled.pre`
  background: #000;
  border-radius: 8px;
  padding: 14px;
`;

const HighlightCode = ({ code }) => (
  <Highlight theme={themes.vsDark} code={code} language="ts">
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
);

export const TypeScriptOpenAIIntegrationTutorial = () => {
  const { project } = useCurrentProject();
  const { usage } = useGettingStartedWizard();

  const codeSetupClients = `import { Pezzo, PezzoOpenAIApi } from "@pezzo/client";
import { Configuration } from "openai";

// Initialize the OpenAI client
const configuration = new Configuration({
  apiKey: "<YOUR_OPENAI_API_KEY>"
});

// Initialize the Pezzo client
export const pezzo = new Pezzo({
  apiKey: "<YOUR_PEZZO_API_KEY>", // Can be found in your organization page
  projectId: "${project.id}",
  environment: "Production", // Your desired environment
});

// Create a Pezzo-aware OpenAI client
const openai = new PezzoOpenAIApi(pezzo, configuration);
`;

  const codeWithPromptManagement = `${codeSetupClients}
// Fetch the prompt payload from Pezzo
const prompt = await pezzo.getOpenAIPrompt("<PROMPT_NAME>", {
  variables: { ... }, // If your prompt has variables, you can pass them here
});

// Retrieve the settings for the chat completion
const settings = prompt.getChatCompletionSettings();

// Use the OpenAI API as you normally would
const response = await openai.createChatCompletion(settings);
`;

  const codeObservabilityOnly = `${codeSetupClients}
// Use the OpenAI API as you normally would
const response = await openai.createChatCompletion({ ... });
  `;

  const code =
    usage === Usage.ObservabilityAndPromptManagement
      ? codeWithPromptManagement
      : codeObservabilityOnly;

  return (
    <>
      {usage === Usage.ObservabilityAndPromptManagement && (
        <>
          <Typography.Title level={3}>
            Create and publish a prompt
          </Typography.Title>
          <Typography.Paragraph>
            Create your first prompt and publish it to your desired environment.
            <br />
            Not sure how to start? Follow the{" "}
            <a
              href="https://docs.pezzo.ai/docs/tutorial/prompt-engineering"
              target="_blank"
              rel="noreferrer"
            >
              tutorial on our documentation site
            </a>
            .
          </Typography.Paragraph>
        </>
      )}

      <Typography.Title level={3}>Installation</Typography.Title>
      <Typography.Paragraph>
        Pezzo provides a fully-typed NPM package for integration with TypeScript
        projects. server.
      </Typography.Paragraph>
      <StyledPre>
        <code>{`npm install openai @pezzo/client`}</code>
      </StyledPre>
      <Typography.Title level={3} style={{ marginTop: 24 }}>
        Usage
      </Typography.Title>
      <Typography.Paragraph>
        {usage === Usage.Observability
          ? "Initialize the OpenAI client as shown below, and consume the OpenAI API as you normally would. As soon as you interact with OpenAI, your requests will be available in the Requests view."
          : "Managing your prompts with Pezzo is easy. You will fetch the prompt payload from Pezzo, and then pass it to the OpenAI client as an argument. As soon as you interact with OpenAI, your requests will be available in the Requests view."}
      </Typography.Paragraph>
      <HighlightCode code={code} />
    </>
  );
};
