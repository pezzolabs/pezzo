import { Alert, Typography } from "antd";
import { HighlightCode } from "./HighlightCode";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import styled from "@emotion/styled";
import { useCurrentPrompt } from "~/lib/providers/CurrentPromptContext";
import { usePromptVersionEditorContext } from "~/lib/providers/PromptVersionEditorContext";
import { usePezzoApiKeys } from "~/graphql/hooks/queries";

const StyledPre = styled.pre`
  background: #000;
  border-radius: 8px;
  padding: 14px;
`;

const getVariablesString = (variables: string[]) => {
  if (!variables.length) return "";
  const varStrings = variables.map((v) => `       "${v}": "value"`).join(",\n");
  return `
    "variables": {
${varStrings}
    }`;
};

export const PythonOpenAIIntegrationTutorial = () => {
  const { variables } = usePromptVersionEditorContext();
  const { prompt } = useCurrentPrompt();
  const { data: pezzoApiKeysData } = usePezzoApiKeys();
  const API_KEY = pezzoApiKeysData?.apiKeys[0].id;

  const { project } = useCurrentProject();
  const codeSetupClients = `from pezzo.client import pezzo
from pezzo.openai import openai

/*
 * The Pezzo client automatically searches for the following environment variables and uses them to initialize the cilent:
 * - PEZZO_API_KEY: Your Pezzo API key
 * - PEZZO_PROJECT_ID: The ID of the project you want to use
 * - PEZZO_ENVIRONMENT: The environment you want to use. By default, Pezzo creates a "Production" environment for you.
 */
`;

  const variablesString = getVariablesString(variables);

  const codeWithPromptManagement = `${codeSetupClients}
// Fetch the prompt from Pezzo
prompt = pezzo.get_prompt("${prompt.name}")

// Use the OpenAI API as you normally would
response = await openai.ChatCompletion.create(
  pezzo_prompt=prompt,
  pezzo_options={${variablesString}
  }
)
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
        Pezzo provides a package for intergration with Python projects. Here's
        how to install it:
      </Typography.Paragraph>
      <StyledPre>
        <code>
          # via pip
          <br />
          pip install pezzo
          <br />
          <br />
          # via poetry
          <br />
          poetry add pezzo
        </code>
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
        <strong>custom properties</strong> and <strong>caching</strong> when
        executing prompts. These properties will be available in the Requests
        view.{" "}
        <a
          href="https://docs.pezzo.ai/client/integrations/openai#custom-properties"
          target="_blank"
          rel="noreferrer"
        >
          Read more in the Pezzo Documentation
        </a>
        .
      </Typography.Paragraph>
    </>
  );
};
