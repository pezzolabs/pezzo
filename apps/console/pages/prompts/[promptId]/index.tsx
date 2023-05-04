import { Breadcrumb, Button, Col, Row, Space, Tabs } from "antd";
import {
  EditOutlined,
  HistoryOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PromptHistoryView } from "../../../components/prompts/views/PromptHistoryView";
import { PromptEditView } from "../../../components/prompts/views/PromptEditView";
import { css } from "@emotion/css";
import { DeletePromptConfirmationModal } from "../../../components/prompts/DeletePromptConfirmationModal";
import { useCurrentPrompt } from "../../../lib/providers/CurrentPromptContext";

const TabLabel = styled.div`
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
`;

const BreadcrumbTitle = styled.span`
  cursor: pointer;
`;

const PromptPage = () => {
  const { setCurrentPromptId, prompt } = useCurrentPrompt();
  const router = useRouter();
  const [activeView, setActiveView] = useState("edit");
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);

  useEffect(() => {
    if (router.query?.promptId) {
      setCurrentPromptId(router.query.promptId as string, "latest");
    }
  }, [router.query.promptId]);

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
    prompt && (
      <>
        <DeletePromptConfirmationModal
          open={isDeleteConfirmationModalOpen}
          onClose={() => setIsDeleteConfirmationModalOpen(false)}
          onConfirm={() => setIsDeleteConfirmationModalOpen(false)}
        />
        <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
          <Col span={16}>
            <Breadcrumb
              style={{ marginBottom: 12 }}
              items={[
                {
                  title: <BreadcrumbTitle>Prompts</BreadcrumbTitle>,
                  onClick: () => router.push("/prompts"),
                },
                {
                  title: prompt.name,
                  key: "prompt",
                },
              ]}
            />
          </Col>
          <Col
            span={8}
            className={css`
              display: flex;
              justify-content: flex-end;
            `}
          >
            <Space wrap>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => setIsDeleteConfirmationModalOpen(true)}
              >
                Delete
              </Button>
            </Space>
          </Col>
        </Row>
        <Tabs
          items={tabs}
          onChange={(selectedView) => setActiveView(selectedView)}
        ></Tabs>

        {activeView === "history" && <PromptHistoryView />}
        {activeView === "edit" && <PromptEditView />}
      </>
    )
  );
};

export default PromptPage;
