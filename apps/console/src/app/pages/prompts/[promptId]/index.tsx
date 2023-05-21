import {
  Breadcrumb,
  Button,
  Col,
  Row,
  Space,
  Spin,
  Tabs,
  Typography,
} from "antd";
import {
  EditOutlined,
  HistoryOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { PromptHistoryView } from "../../../components/prompts/views/PromptHistoryView";
import { PromptEditView } from "../../../components/prompts/views/PromptEditView";
import { css } from "@emotion/css";
import { DeletePromptConfirmationModal } from "../../../components/prompts/DeletePromptConfirmationModal";
import { useCurrentPrompt } from "../../../lib/providers/CurrentPromptContext";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrentProject } from "../../../lib/providers/CurrentProjectContext";

const TabLabel = styled.div`
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
`;

const BreadcrumbTitle = styled.span`
  cursor: pointer;
`;

export const PromptPage = () => {
  const params = useParams();
  const { setCurrentPromptId, prompt, integration, isLoading } =
    useCurrentPrompt();
  const [activeView, setActiveView] = useState("edit");
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
        </>
      )}
    </Spin>
  );
};
