import { Tag } from "~/components/common/Tag";
import { useEditorContext } from "~/lib/providers/EditorContext";

export const Variables = () => {
  const { variables } = useEditorContext();

  return (
    <>
      {variables.length === 0 && (
        <p className="text-muted-foreground italic">No variables found.</p>
      )}

      {variables.map((key) => (
        <Tag key={key}>{key}</Tag>
      ))}
    </>
  );
};
