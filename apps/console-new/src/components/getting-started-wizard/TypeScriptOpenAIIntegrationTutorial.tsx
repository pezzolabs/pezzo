import { HighlightCode } from "./HighlightCode";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import styled from "@emotion/styled";
import { useCurrentPrompt } from "~/lib/providers/CurrentPromptContext";
import { usePezzoApiKeys } from "~/graphql/hooks/queries";
import { useEditorContext } from "~/lib/providers/EditorContext";
import { Alert, AlertDescription, AlertTitle } from "@pezzo/ui";
import { Link } from "react-router-dom";
import { InfoIcon } from "lucide-react";

const StyledPre = styled.pre`
  background: #000;
  border-radius: 8px;
  padding: 14px;
`;

const getVariablesString = (variables: string[]) => {
  if (!variables.length) return "";
  const varStrings = variables.map((v) => `    ${v}: "value"`).join(",\n");
  return `, {
  variables: {
${varStrings}
  }
}`;
};

export const TypeScriptOpenAIIntegrationTutorial = () => {
  const { variables } = useEditorContext();
  const { prompt } = useCurrentPrompt();
  const { pezzoApiKeys } = usePezzoApiKeys();
  const API_KEY = pezzoApiKeys && pezzoApiKeys[0].id;

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
    <div className="flex flex-col gap-4 text-sm">
      <Alert variant="info">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Need some more help?</AlertTitle>
        <AlertDescription>
          Check out the{" "}
          <Link
            target="_blank"
            className="font-semibold text-primary underline"
            to="https://docs.pezzo.ai/client/integrations/openai"
          >
            Using OpenAI With Pezzo
          </Link>{" "}
          page on our documentation to learn more.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col gap-3">
        <h1>Installation</h1>
        <p>
          Pezzo provides a fully-typed NPM package for integration with
          TypeScript projects.
        </p>
        <StyledPre>
          <code>{"npm install @pezzo/client openai"}</code>
        </StyledPre>
      </div>

      <div className="flex flex-col gap-3">
        <h1>Usage</h1>
        <p>
          Managing your prompts with Pezzo is easy. You will fetch the prompt
          payload from Pezzo, and then pass it to the OpenAI client as an
          argument. As soon as you interact with OpenAI, your requests will be
          available in the Requests view.
        </p>
        <HighlightCode code={codeWithPromptManagement} language="ts" />
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
