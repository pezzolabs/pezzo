import { HighlightCode } from "./HighlightCode";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";
import { useCurrentPrompt } from "../../lib/providers/CurrentPromptContext";
import { useEditorContext } from "../../lib/providers/EditorContext";
import { Alert, AlertDescription, AlertTitle } from "../../../../../libs/ui/src";
import { Link } from "react-router-dom";
import { InfoIcon } from "lucide-react";
import { usePezzoApiKeys } from "../../graphql/hooks/queries";
import { StyledPre } from "./StyledPre";

const getVariablesString = (variables: string[]) => {
  if (!variables.length) return "";
  const varStrings = variables.map((v) => `       "${v}": "value"`).join(",\n");
  return `
    "variables": {
${varStrings}
    }`;
};

export const PythonOpenAIIntegrationTutorial = () => {
  const { variables } = useEditorContext();
  const { prompt } = useCurrentPrompt();
  const { pezzoApiKeys } = usePezzoApiKeys();
  const API_KEY = pezzoApiKeys && pezzoApiKeys[0].id;

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
    <div className="flex w-full flex-col gap-4 text-sm">
      <Alert variant="info">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Need some more help?</AlertTitle>
        <AlertDescription>
          Check out the{" "}
          <Link
            className="font-semibold text-primary underline"
            target="_blank"
            to="https://docs.pezzo.ai/client/integrations/openai"
          >
            Using OpenAI With Pezzo
          </Link>{" "}
          page on our documentation to learn more.
        </AlertDescription>
      </Alert>

      <h1>Installation</h1>
      <p>
        Pezzo provides a package for intergration with Python projects. Here's
        how to install it:
      </p>
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

      <div className="flex flex-col gap-3">
        <h1>Usage</h1>
        <p>
          Managing your prompts with Pezzo is easy. You will fetch the prompt
          payload from Pezzo, and then pass it to the OpenAI client as an
          argument. As soon as you interact with OpenAI, your requests will be
          available in the Requests view.
        </p>

        <div className="w-full max-w-full">
          <HighlightCode code={codeWithPromptManagement} language="ts" />
        </div>
      </div>

      <p>
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
      </p>
    </div>
  );
};
