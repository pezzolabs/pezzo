import { CaretDownOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import { useCurrentPrompt } from "../../lib/providers/CurrentPromptContext";
import { useState } from "react";
import { usePromptVersions } from "../../lib/hooks/usePromptVersions";
import { usePromptVersionEditorContext } from "../../lib/providers/PromptVersionEditorContext";

export const PromptVersionSelector = () => {
  const { currentVersionSha, setCurrentVersionSha, isDraft } =
    usePromptVersionEditorContext();
  const { prompt } = useCurrentPrompt();
  const latestVersion = prompt.latestVersion;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { promptVersions } = usePromptVersions(prompt.id, isDropdownOpen);

  const itemsFromVersionsList =
    (promptVersions &&
      promptVersions
        .filter((version) => version.sha !== latestVersion.sha)
        .map((version) => ({
          key: version.sha,
          label: version.sha.slice(0, 7),
          onClick: () => setCurrentVersionSha(version.sha),
        }))) ||
    [];

  const menu = {
    items: [
      {
        key: "latest",
        label: `Latest (${latestVersion.sha.slice(0, 7)})`,
        onClick: () => setCurrentVersionSha(latestVersion.sha),
      },
      ...itemsFromVersionsList,
    ],
  };

  const isLatest = currentVersionSha === latestVersion.sha;

  const selectedVersionLabel = isLatest
    ? `Latest (${latestVersion.sha.slice(0, 7)})`
    : `${currentVersionSha.slice(0, 7)}`;

  return (
    <Dropdown trigger={["click"]} onOpenChange={setIsDropdownOpen} menu={menu}>
      <Button icon={<CaretDownOutlined />}>{selectedVersionLabel}</Button>
    </Dropdown>
  );
};
