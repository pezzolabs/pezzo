import { InfoCircleFilled, LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Space,
  Tooltip,
  Typography,
  theme,
} from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Navigate, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { useGetCurrentUser, useGetProjects } from "../../lib/hooks/queries";
import {
  useCreateProjectMutation,
  useUpdateCurrentUserMutation,
} from "../../lib/hooks/mutations";
import { useCallback, useEffect } from "react";
import { Form } from "antd";
import {
  CreateProjectMutation,
  Project,
  UpdateProfileMutation,
} from "@pezzo/graphql";

const StyledButton = styled(Button)<{ spacing: number }>`
  margin-top: ${(props) => props.spacing}px;
`;

const VerticalSpace = styled(Space)`
  width: 100%;
`;
VerticalSpace.defaultProps = {
  direction: "vertical",
};

interface FormValues {
  name: string;
  projectName: string;
}
export const OnboardingPage = () => {
  const [form] = Form.useForm<FormValues>();
  const { mutateAsync: updateCurrentUser, isLoading: isUpdatingUserLoading } =
    useUpdateCurrentUserMutation();
  const { mutateAsync: createProject, isLoading: isProjectCreationLoading } =
    useCreateProjectMutation();
  const {
    data: projectsData,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
  } = useGetProjects();

  const {
    data: currentUserData,
    isLoading: isCurrentUserLoading,
    isError: isCurrentUserError,
  } = useGetCurrentUser();

  const { token } = theme.useToken();
  const navigate = useNavigate();

  const isCreatingProject = isProjectCreationLoading || isUpdatingUserLoading;
  const hasProjects = projectsData?.projects.length > 0;
  const currentUser = currentUserData?.me;
  const hasName = !!currentUser?.name;

  const handleCreateProject = useCallback(
    async (values: FormValues) => {
      const actions: [
        Promise<CreateProjectMutation>,
        Promise<UpdateProfileMutation | null>
      ] = [
        createProject({
          name: values.projectName,
          organizationId: currentUser.organizationIds[0],
        }),
        null,
      ];

      if (!hasName) {
        actions.push(
          updateCurrentUser({
            name: values.name,
          })
        );
      }

      await Promise.all(actions.filter(Boolean));
      return navigate("/projects?finished=true");
    },
    [updateCurrentUser, createProject, currentUser, hasName, navigate]
  );

  useEffect(() => {
    if (projectsData?.projects && projectsData?.projects.length > 0) {
      navigate("/projects", { replace: true });
    }
  }, [projectsData, navigate]);

  if (isProjectsLoading || isCurrentUserLoading) {
    return <LoadingOutlined />;
  }

  return (
    <Modal
      open
      closable={false}
      title={
        <Typography.Title level={3}>
          Let's create your first project{" "}
          <span role="img" aria-label="emoji">
            🎉
          </span>
        </Typography.Title>
      }
      footer={null}
    >
      <Form form={form} name="onboarding-form" onFinish={handleCreateProject}>
        <VerticalSpace
          style={{ width: "100%", marginTop: token.marginLG }}
          size="large"
        >
          {!hasName && (
            <VerticalSpace>
              <Typography.Text>What's your name?</Typography.Text>
              <Form.Item name="name">
                <Input placeholder="John Doe" />
              </Form.Item>
            </VerticalSpace>
          )}

          <VerticalSpace>
            <Row gutter={4} align="middle">
              <Col>
                <Typography.Text>
                  How do you wanna call your first project?
                </Typography.Text>
              </Col>
              <Tooltip title="A project is a collection of prompts">
                <Col flex="grow">
                  <Button
                    type="text"
                    icon={<InfoCircleFilled />}
                    loading={isCreatingProject}
                  />
                </Col>
              </Tooltip>
            </Row>

            <Form.Item
              name="projectName"
              rules={[
                {
                  required: true,
                  message: "Please set a name to your project",
                },
              ]}
            >
              <Input placeholder="Content Creation" />
            </Form.Item>
          </VerticalSpace>
        </VerticalSpace>
        <Row justify="end">
          <StyledButton spacing={token.marginLG} htmlType="submit">
            Create a project <ArrowRightOutlined />
          </StyledButton>
        </Row>
      </Form>
    </Modal>
  );
};
