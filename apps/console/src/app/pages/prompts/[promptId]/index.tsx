import { Spin, Tabs } from "antd";
import {
  EditOutlined,
  HistoryOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { PromptHistoryView } from "../../../components/prompts/views/PromptHistoryView";
import { PromptEditView } from "../../../components/prompts/views/PromptEditView";
import { DeletePromptConfirmationModal } from "../../../components/prompts/DeletePromptConfirmationModal";
import { useCurrentPrompt } from "../../../lib/providers/CurrentPromptContext";
import { DashboardView } from "../../../components/prompts/views/DashboardView";
import { useParams } from "react-router-dom";

const TabLabel = styled.div`
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
`;

export const PromptPage = () => {
  const params = useParams();
  const { setCurrentPromptId, prompt, isLoading } = useCurrentPrompt();
  const [activeView, setActiveView] = useState("dashboard");
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);

  useEffect(() => {
    if (params.promptId) {
      setCurrentPromptId(params.promptId as string, "latest");
    }
  }, [params.promptId]);

  const tabs = [
    {
      label: (
        <TabLabel>
          <DashboardOutlined /> Dashboard
        </TabLabel>
      ),
      key: "dashboard",
    },
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
          <HistoryOutlined /> History
        </TabLabel>
      ),
      key: "history",
    },
  ];

  return (
    <Spin size="large" spinning={isLoading}>
      <DeletePromptConfirmationModal
        open={isDeleteConfirmationModalOpen}
        onClose={() => setIsDeleteConfirmationModalOpen(false)}
        onConfirm={() => setIsDeleteConfirmationModalOpen(false)}
      />

      <Tabs
        items={tabs}
        onChange={(selectedView) => setActiveView(selectedView)}
      ></Tabs>

      {prompt && (
        <>
          {activeView === "history" && <PromptHistoryView />}
          {activeView === "edit" && <PromptEditView />}
          {activeView === "dashboard" && <DashboardView />}
        </>
      )}
    </Spin>
  );
};
