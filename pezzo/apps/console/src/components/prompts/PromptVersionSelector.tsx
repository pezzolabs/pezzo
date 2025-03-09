import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../../../libs/ui/src";
import { useCurrentPrompt } from "../../lib/providers/CurrentPromptContext";
import { usePromptVersions } from "../../lib/hooks/usePromptVersions";
import { trackEvent } from "../../lib/utils/analytics";
import { useEditorContext } from "../../lib/providers/EditorContext";

export const PromptVersionSelector = () => {
  const { prompt } = useCurrentPrompt();
  const latestVersion = prompt.latestVersion;
  const { promptVersions } = usePromptVersions(prompt.id);
  const { currentVersionSha, setCurrentVersionSha } = useEditorContext();

  const itemsFromVersionsList =
    (promptVersions &&
      promptVersions
        .filter((version) => version.sha !== latestVersion.sha)
        .map((version) => ({
          key: version.sha,
          label: `${version.sha.slice(0, 7)} - ${version.message} (by ${
            version.createdBy.name
          })`,
          onClick: () => {
            alert(version.sha);
            setCurrentVersionSha(version.sha);
            trackEvent("prompt_version_selected");
          },
        }))) ||
    [];

  const menuItems = [
    {
      key: latestVersion.sha,
      label: `Latest (${latestVersion.sha.slice(0, 7)}) - ${
        latestVersion.message
      } (by ${latestVersion.createdBy.name}))`,
      sha: latestVersion.sha,
    },
    ...itemsFromVersionsList,
  ];

  const handleVersionChange = (versionSha: string) => {
    setCurrentVersionSha(versionSha);
    trackEvent("prompt_version_selected", {
      version: versionSha,
    });
  };

  const isLatest = currentVersionSha === latestVersion.sha;

  const selectedVersionLabel = isLatest
    ? `Latest (${latestVersion.sha.slice(0, 7)})`
    : `${currentVersionSha.slice(0, 7)}`;

  return (
    <div className="w-80">
      <Select value={currentVersionSha} onValueChange={handleVersionChange}>
        <SelectTrigger>
          <SelectValue>{selectedVersionLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {menuItems.map((item) => (
            <SelectItem
              key={item.key}
              value={item.key}
              className="cursor-pointer rounded-sm p-2 transition-all hover:bg-muted"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
