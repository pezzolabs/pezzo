import { Alert, Typography } from "antd";
import { HighlightCode } from "./HighlightCode";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";
import styled from "@emotion/styled";
import { useCurrentPrompt } from "../../lib/providers/CurrentPromptContext";
import { usePromptVersionEditorContext } from "../../lib/providers/PromptVersionEditorContext";
import { usePezzoApiKeys } from "../../graphql/hooks/queries";

const StyledPre = styled.pre`
  background: #000;
  border-radius: 8px;
  padding: 14px;
`;

const getVariablesString = (variables: string[]) => {
  if (!variables.length) return "";
  const varStrings = variables.map((v) => `    "${v}": "value"`).join(",\n");
  return `, {
  variables: {
${varStrings}
  }
}`;
};

export const TypeScriptOpenAIIntegrationTutorial = () => {
  const { variables } = usePromptVersionEditorContext();
  const { prompt } = useCurrentPrompt();
  const { data: pezzoApiKeysData } = usePezzoApiKeys();
  const API_KEY = pezzoApiKeysData?.apiKeys[0].id;

  const { project } = useCurrentProject();
  const codeSetupClients = `import { Pezzo, PezzoOpenAI } from "@pezzo/client";

// Initialize the Pezzo client
export const pezzo = new Pezzo({
  apiKey: "${API_KEY}",
  projectId: "${project.id}",
  environment: "Production", // Your desired environment
});

// Initialize the PezzoOpenAI client
const openai = new PezzoOpenAI(pezzo);
`;

  const variablesString = getVariablesString(variables);

  const codeWithPromptManagement = `${codeSetupClients}
// Fetch the prompt from Pezzo
const prompt = await pezzo.getPrompt("${prompt.name}");

// Use the OpenAI API as you normally would
const response = await openai.chat.completions.create(prompt${variablesString});
`;

  return (
    <>
      <Typography.Title level={3}>Want to know more?</Typography.Title>

      <Alert
        showIcon
        type="info"
        message="Need some more help?"
        description={
          <Typography.Paragraph style={{ marginBottom: 0 }}>
            Check out the{" "}
            <a
              href="https://docs.pezzo.ai/client/integrations/openai"
              target="_blank"
              rel="noreferrer"
            >
              Using OpenAI With Pezzo
            </a>{" "}
            page on our documentation to learn more.
          </Typography.Paragraph>
        }
        style={{ marginBottom: 12 }}
      />

      <Typography.Title level={3}>Installation</Typography.Title>
      <Typography.Paragraph>
        Pezzo provides a fully-typed NPM package for integration with TypeScript
        projects.
      </Typography.Paragraph>
      <StyledPre>
        <code>{"npm install @pezzo/client openai"}</code>
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

      <Typography.Paragraph>
        In addition to vriables, you can also provide{" "}
        <strong>custom properties</strong> when executing prompts. These
        properties will be available in the Requests view.{" "}
        <a
          href="https://docs.pezzo.ai/client/integrations/openai#custom-properties"
          target="_blank"
          rel="noreferrer"
        >
          Read more about Properties in the Pezzo Documentation
        </a>
        .
      </Typography.Paragraph>
    </>
  );
};
