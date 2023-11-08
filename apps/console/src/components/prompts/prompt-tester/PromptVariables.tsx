import { PromptTesterVariablesInputs } from "~/lib/providers/PromptTesterContext";
import { PromptVariable } from "./PromptVariable";
import { isJson } from "~/lib/utils/is-json";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormMessage } from "@pezzo/ui";

interface Props {
  variables: Record<string, string>;
  form: UseFormReturn<PromptTesterVariablesInputs>;
}

export const PromptVariables = ({ variables, form }: Props) => {
  if (Object.keys(variables).length === 0) {
    return <p className="italic text-muted-foreground">No variables found</p>;
  }

  return (
    <>
      <p className="mb-4">Provide values for your variables below.</p>
      <div className="flex flex-col gap-6 text-sm">
        {Object.keys(variables).map((variableName) => (
          <FormField
            control={form.control}
            name={`${variableName}`}
            render={({ field }) => (
              <FormItem>
                <PromptVariable
                  field={field}
                  key={variableName}
                  name={variableName}
                  value={
                    isJson(variables[variableName])
                      ? JSON.stringify(
                          JSON.parse(variables[variableName]),
                          null,
                          2
                        )
                      : variables[variableName]
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </>
  );
};
