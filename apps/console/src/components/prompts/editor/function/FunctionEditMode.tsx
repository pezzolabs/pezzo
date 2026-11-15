import { useState, useCallback } from "react";
import {
  Button,
  Card,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@pezzo/ui";
import { PlusIcon, Trash2Icon, GripVerticalIcon } from "lucide-react";
import { useEditorContext } from "~/lib/providers/EditorContext";
import { trackEvent } from "~/lib/utils/analytics";
import { useCurrentPrompt } from "~/lib/providers/CurrentPromptContext";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

/** Single parameter in a function definition */
interface FunctionParameter {
  id: string;
  name: string;
  type: string;
  description: string;
  required: boolean;
  enum?: string[];
}

/** A function definition as stored in the backend */
interface FunctionDefinition {
  name: string;
  description: string;
  parameters: FunctionParameter[];
}

const DEFAULT_PARAMETER: Omit<FunctionParameter, "id"> = {
  name: "",
  type: "string",
  description: "",
  required: false,
};

/**
 * JSON Schema editor for OpenAI Function Calling definitions.
 *
 * The backend already persists the `function` object — this component
 * provides the editing UI.  Changes are stored via the EditorContext form.
 */
export const FunctionEditMode = () => {
  const { getForm } = useEditorContext();
  const { promptId } = useCurrentPrompt();
  const form = getForm();

  // Read/write the function field from the form
  const [functions, setFunctions] = useState<FunctionDefinition[]>(() => {
    const current = form.getValues("content") as any;
    return current?.functions || [];
  });

  const syncToForm = useCallback(
    (updated: FunctionDefinition[]) => {
      setFunctions(updated);
      form.setValue("content.functions" as any, updated, {
        shouldDirty: true,
      });
    },
    [form]
  );

  const addFunction = () => {
    trackEvent("prompt_function_created", { promptId });
    syncToForm([
      ...functions,
      { name: "", description: "", parameters: [] },
    ]);
  };

  const removeFunction = (index: number) => {
    syncToForm(functions.filter((_, i) => i !== index));
  };

  const updateFunction = (
    index: number,
    patch: Partial<FunctionDefinition>
  ) => {
    const updated = [...functions];
    updated[index] = { ...updated[index], ...patch };
    syncToForm(updated);
  };

  const addParameter = (funcIndex: number) => {
    const updated = [...functions];
    updated[funcIndex] = {
      ...updated[funcIndex],
      parameters: [
        ...updated[funcIndex].parameters,
        { ...DEFAULT_PARAMETER, id: crypto.randomUUID() },
      ],
    };
    syncToForm(updated);
  };

  const removeParameter = (funcIndex: number, paramId: string) => {
    const updated = [...functions];
    updated[funcIndex] = {
      ...updated[funcIndex],
      parameters: updated[funcIndex].parameters.filter(
        (p) => p.id !== paramId
      ),
    };
    syncToForm(updated);
  };

  const updateParameter = (
    funcIndex: number,
    paramId: string,
    patch: Partial<FunctionParameter>
  ) => {
    const updated = [...functions];
    updated[funcIndex] = {
      ...updated[funcIndex],
      parameters: updated[funcIndex].parameters.map((p) =>
        p.id === paramId ? { ...p, ...patch } : p
      ),
    };
    syncToForm(updated);
  };

  // ── Drag & Drop for parameters ──
  const onDragEnd = (funcIndex: number) => (result: DropResult) => {
    if (!result.destination) return;
    const updated = [...functions];
    const params = Array.from(updated[funcIndex].parameters);
    const [moved] = params.splice(result.source.index, 1);
    params.splice(result.destination.index, 0, moved);
    updated[funcIndex] = { ...updated[funcIndex], parameters: params };
    syncToForm(updated);
  };

  return (
    <div className="flex flex-col gap-6">
      {functions.map((func, fi) => (
        <Card key={fi} className="p-4">
          {/* ── Function Header ── */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1 space-y-3 pr-4">
              <Input
                placeholder="Function name (e.g. get_weather)"
                value={func.name}
                onChange={(e) =>
                  updateFunction(fi, { name: e.target.value })
                }
                className="font-mono text-sm"
              />
              <Textarea
                placeholder="Description of what this function does"
                value={func.description}
                onChange={(e) =>
                  updateFunction(fi, { description: e.target.value })
                }
                rows={2}
                className="text-sm"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeFunction(fi)}
            >
              <Trash2Icon className="h-4 w-4 text-red-500" />
            </Button>
          </div>

          {/* ── Parameters ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Parameters
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addParameter(fi)}
              >
                <PlusIcon className="mr-1 h-3 w-3" />
                Add Parameter
              </Button>
            </div>

            <DragDropContext onDragEnd={onDragEnd(fi)}>
              <Droppable droppableId={`params-${fi}`}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {func.parameters.map((param, pi) => (
                      <Draggable
                        key={param.id}
                        draggableId={param.id}
                        index={pi}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-start gap-2 rounded-md border bg-muted/30 p-2"
                          >
                            <div {...provided.dragHandleProps}>
                              <GripVerticalIcon className="mt-2 h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex gap-2">
                                <Input
                                  placeholder="name"
                                  value={param.name}
                                  onChange={(e) =>
                                    updateParameter(fi, param.id, {
                                      name: e.target.value,
                                    })
                                  }
                                  className="h-8 flex-[2] text-sm"
                                />
                                <select
                                  value={param.type}
                                  onChange={(e) =>
                                    updateParameter(fi, param.id, {
                                      type: e.target.value,
                                    })
                                  }
                                  className="h-8 flex-1 rounded-md border bg-background px-2 text-sm"
                                >
                                  <option value="string">string</option>
                                  <option value="number">number</option>
                                  <option value="boolean">boolean</option>
                                  <option value="object">object</option>
                                  <option value="array">array</option>
                                </select>
                                <label className="flex items-center gap-1 text-xs">
                                  <input
                                    type="checkbox"
                                    checked={param.required}
                                    onChange={(e) =>
                                      updateParameter(fi, param.id, {
                                        required: e.target.checked,
                                      })
                                    }
                                    className="h-3 w-3"
                                  />
                                  Required
                                </label>
                              </div>
                              <Input
                                placeholder="Description"
                                value={param.description}
                                onChange={(e) =>
                                  updateParameter(fi, param.id, {
                                    description: e.target.value,
                                  })
                                }
                                className="h-8 text-xs"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeParameter(fi, param.id)}
                            >
                              <Trash2Icon className="h-3 w-3 text-red-400" />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </Card>
      ))}

      <Button variant="outline" onClick={addFunction} className="w-full">
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Function
      </Button>
    </div>
  );
};
