import { CaretDownOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Dropdown } from "antd";
import { GET_PROMPT_VERSIONS_LIST } from "../../graphql/queries/prompts";
import { gqlClient } from "../../lib/graphql";
import { useCurrentPrompt } from "../../lib/providers/CurrentPromptContext";
import { useState } from "react";

export const PromptVersionSelector = () => {
  const { prompt, currentPromptVersion, setPromptVersion } = useCurrentPrompt();
  const latestVersion = prompt.latestVersion;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: promptVersionsList } = useQuery({
    queryKey: ["promptVersionsList", prompt.id],
    queryFn: () =>
      gqlClient.request(GET_PROMPT_VERSIONS_LIST, {
        data: { id: prompt.id },
      }),
    enabled: isDropdownOpen,
  });

  const itemsFromVersionsList =
    promptVersionsList?.promptVersions
      .filter((version) => version.sha !== latestVersion.sha)
      .map((version) => ({
        key: version.sha,
        label: version.sha.slice(0, 7),
        onClick: () => setPromptVersion(version.sha),
      })) || [];

  const menu = {
    items: [
      {
        key: "latest",
        label: `Latest (${latestVersion.sha.slice(0, 7)})`,
        onClick: () => setPromptVersion("latest"),
      },
      ...itemsFromVersionsList,
    ],
  };

  const isLatest = currentPromptVersion.sha === latestVersion.sha;

  const selectedVersionLabel = isLatest
    ? `Latest (${latestVersion.sha.slice(0, 7)})`
    : `${currentPromptVersion.sha.slice(0, 7)}`;

  return (
    <Dropdown trigger={["click"]} onOpenChange={setIsDropdownOpen} menu={menu}>
      <Button icon={<CaretDownOutlined />}>{selectedVersionLabel}</Button>
    </Dropdown>
  );
};
