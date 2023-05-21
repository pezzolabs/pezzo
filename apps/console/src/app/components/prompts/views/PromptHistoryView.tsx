import { usePromptExecutions } from "../../../lib/hooks/usePromptExecutions";
import { useCurrentPrompt } from "../../../lib/providers/CurrentPromptContext";
import { Button, Space, Table, Tag, Tooltip } from "antd";
import { PromptExecutionStatus } from "@pezzo/graphql";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { InlineCodeSnippet } from "../../common/InlineCodeSnippet";
import { PromptTester } from "../PromptTester";
import { usePromptTester } from "../../../lib/providers/PromptTesterContext";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { css } from "@emotion/css";

export const PromptHistoryView = () => {
  const { prompt } = useCurrentPrompt();
  const { promptExecutions } = usePromptExecutions(prompt.id);
  const { openTester, loadTestResult } = usePromptTester();

  const handleInspect = async (promptExecution) => {
    loadTestResult(promptExecution);
    openTester();
  };

  if (!promptExecutions) {
    return null;
  }

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (value) => <span>{value}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: PromptExecutionStatus) =>
        value === PromptExecutionStatus.Success ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Success
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Error
          </Tag>
        ),
    },
    {
      title: "Cost",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (value) => <span>${Number(value).toFixed(4)}</span>,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (value) => <span>{Math.ceil(value / 1000)}s</span>,
    },
    {
      title: "Version",
      dataIndex: "promptVersionSha",
      key: "promptVersionSha",
      render: (value) => (
        <InlineCodeSnippet>{value.substring(0, 7)}</InlineCodeSnippet>
      ),
    },
    {
      render: (promptExecution) => (
        <div
          className={css`
            display: flex;
            justify-content: flex-end;
            align-items: center;
          `}
        >
          <Space wrap>
            <Tooltip title="Inspect">
              <Button
                onClick={() => handleInspect(promptExecution)}
                icon={<MagnifyingGlassIcon height={18} />}
              />
            </Tooltip>
          </Space>
        </div>
      ),
    },
  ];

  const data = promptExecutions.map((data) => data);

  return (
    <>
      <PromptTester />
      <Table columns={columns} dataSource={data} />
    </>
  );
};
