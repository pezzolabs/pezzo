import { Spin, Tabs } from "antd";
import {
  EditOutlined,
  BranchesOutlined,
  SettingOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { useState } from "react";
import { useCurrentPrompt } from "~/lib/providers/CurrentPromptContext";
import { MetricsView } from "~/components/prompts/views/MetricsView";
import { PromptVersionsView } from "~/components/prompts/views/PromptVersionsView";
import { PromptSettingsView } from "~/components/prompts/views/PromptSettingsView";
import { PromptEditView } from "~/components/prompts/views/PromptEditView";
import { PromptVersionEditorProvider } from "~/lib/providers/PromptVersionEditorContext";
import { PromptTesterProvider } from "~/lib/providers/PromptTesterContext";
import { usePageTitle } from "~/lib/hooks/usePageTitle";

const TabLabel = styled.div`
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
`;

export const PromptPage = () => {
  const { prompt, isLoading } = useCurrentPrompt();
  const [activeView, setActiveView] = useState("edit");
  usePageTitle(prompt?.name);
  const tabs = [
    {
      label: (
        <TabLabel>
          <EditOutlined /> Edit
        </TabLabel>
      ),
      key: "edit",
    },
    {
      label: (
        <TabLabel>
          <BranchesOutlined /> Versions
        </TabLabel>
      ),
      key: "versions",
    },
    {
      label: (
        <TabLabel>
          <BarChartOutlined /> Metrics
        </TabLabel>
      ),
      key: "metrics",
    },
    {
      label: (
        <TabLabel>
          <SettingOutlined /> Settings
        </TabLabel>
      ),
      key: "settings",
    },
  ];

  return (
    <Spin size="large" spinning={isLoading}>
      <Tabs
        items={tabs}
        onChange={(selectedView) => setActiveView(selectedView)}
      ></Tabs>

      {prompt && (
        <>
          {activeView === "edit" && (
            <PromptVersionEditorProvider>
              <PromptTesterProvider>
                <PromptEditView />
              </PromptTesterProvider>
            </PromptVersionEditorProvider>
          )}
          {activeView === "metrics" && <MetricsView />}
          {activeView === "versions" && <PromptVersionsView />}
          {activeView === "settings" && <PromptSettingsView />}
        </>
      )}
    </Spin>
  );
};
