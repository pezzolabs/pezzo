import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@pezzo/ui";
import { useEditorContext } from "~/lib/providers/EditorContext";
import { useWatch } from "react-hook-form";
import { BracesIcon } from "lucide-react";

/**
 * Displays the current function definitions as a formatted JSON
 * preview — matching the OpenAI function calling schema.
 */
export const FunctionCallSettingsCard = () => {
  const { getForm } = useEditorContext();
  const form = getForm();

  const functions = useWatch({
    control: form.control,
    name: "content.functions",
  }) as any[] | undefined;

  // Convert internal representation to OpenAI format
  const openaiFunctions = (functions || [])
    .filter((f: any) => f.name)
    .map((f: any) => ({
      name: f.name,
      description: f.description || undefined,
      parameters: {
        type: "object",
        properties: Object.fromEntries(
          (f.parameters || []).map((p: any) => [
            p.name,
            {
              type: p.type,
              description: p.description || undefined,
              ...(p.enum?.length ? { enum: p.enum } : {}),
            },
          ])
        ),
        required: (f.parameters || [])
          .filter((p: any) => p.required)
          .map((p: any) => p.name),
      },
    }));

  if (!functions?.length) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <BracesIcon className="h-4 w-4" />
          Functions ({openaiFunctions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="max-h-64 overflow-auto rounded-md bg-muted p-3 text-xs">
          {JSON.stringify(openaiFunctions, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
};
