import { Spin, Tabs } from "antd";
import {
  EditOutlined,
  HistoryOutlined,
  DashboardOutlined,
  BranchesOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { PromptHistoryView } from "../../../components/prompts/views/PromptHistoryView";
import { useCurrentPrompt } from "../../../lib/providers/CurrentPromptContext";
import { MetricsView } from "../../../components/prompts/views/MetricsView";
import { useParams } from "react-router-dom";
import { PromptVersionsView } from "../../../components/prompts/views/PromptVersionsView";
import { PromptSettingsView } from "../../../components/prompts/views/PromptSettingsView";
import { PromptPlaygroundView } from "../../../components/prompts/views/PromptPlaygroundView";

const TabLabel = styled.div`
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
`;

export const PromptPage = () => {
  const params = useParams();
  const { setCurrentPromptId, prompt, isLoading } = useCurrentPrompt();
  const [activeView, setActiveView] = useState("edit");

  useEffect(() => {
    if (params.promptId) {
      setCurrentPromptId(params.promptId as string, "latest");
    }
  }, [params.promptId]);

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
          <DashboardOutlined /> Metrics
        </TabLabel>
      ),
      key: "metrics",
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
          <HistoryOutlined /> History
        </TabLabel>
      ),
      key: "history",
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
          {activeView === "edit" && <PromptPlaygroundView />}
          {activeView === "metrics" && <MetricsView />}
          {activeView === "versions" && <PromptVersionsView />}
          {activeView === "history" && <PromptHistoryView />}
          {activeView === "settings" && <PromptSettingsView />}
        </>
      )}
    </Spin>
  );
};
