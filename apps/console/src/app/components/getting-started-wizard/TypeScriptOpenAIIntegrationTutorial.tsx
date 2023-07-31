import { Typography } from "antd";
import { HighlightCode } from "./HighlightCode";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";
import styled from "@emotion/styled";
import {
  Usage,
  useGettingStartedWizard,
} from "../../lib/providers/GettingStartedWizardProvider";
import { useCurrentPrompt } from "../../lib/providers/CurrentPromptContext";
import { usePromptVersionEditorContext } from "../../lib/providers/PromptVersionEditorContext";

const StyledPre = styled.pre`
  background: #000;
  border-radius: 8px;
  padding: 14px;
`;

const getVariablesString = (variables: string[]) => {
  if (!variables.length) return "";
  const varStrings = variables.map((v) => `  "${v}": ""`).join(",\n");
  return `, {\n${varStrings}\n}`;
};

export const TypeScriptOpenAIIntegrationTutorial = () => {
  const { variables } = usePromptVersionEditorContext();
  const { prompt } = useCurrentPrompt();

  const { project } = useCurrentProject();
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

  const variablesString = getVariablesString(variables);

  const codeWithPromptManagement = `${codeSetupClients}
// Fetch the prompt payload from Pezzo
const prompt = await pezzo.getPrompt("${prompt.name}");

// Use the OpenAI API as you normally would
const result = await openai.createChatCompletion(prompt${variablesString});
`;

  return (
    <>
      <Typography.Title level={3}>Consume your prompt</Typography.Title>
      <Typography.Paragraph>
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

      <Typography.Title level={3}>Installation</Typography.Title>
      <Typography.Paragraph>
        Pezzo provides a fully-typed NPM package for integration with TypeScript
        projects. server.
      </Typography.Paragraph>
      <StyledPre>
        <code>{"npm install openai @pezzo/client"}</code>
      </StyledPre>
      <Typography.Title level={3} style={{ marginTop: 24 }}>
        Usage
      </Typography.Title>
      <Typography.Paragraph>
        Managing your prompts with Pezzo is easy. You will fetch the prompt
        payload from Pezzo, and then pass it to the OpenAI client as an
        argument. As soon as you interact with OpenAI, your requests will be
        available in the Requests view.
      </Typography.Paragraph>
      <HighlightCode code={codeWithPromptManagement} />
    </>
  );
};
