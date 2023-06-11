import { InfoCircleFilled, LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  Row,
  Space,
  Tooltip,
  Typography,
  Card,
  theme,
} from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { useGetProjects } from "../../lib/hooks/queries";
import {
  useCreateProjectMutation,
  useUpdateCurrentUserMutation,
} from "../../lib/hooks/mutations";
import { useCallback, useEffect } from "react";
import { Form } from "antd";
import {
  CreateProjectMutation,
  UpdateProfileMutation,
} from "../../../@generated/graphql/graphql";
import { useAuthContext } from "../../lib/providers/AuthProvider";

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

  const { projects, isLoading: isProjectsLoading } = useGetProjects();

  const { currentUser } = useAuthContext();

  const { token } = theme.useToken();
  const navigate = useNavigate();

  const isCreatingProject = isProjectCreationLoading || isUpdatingUserLoading;
  const hasName = currentUser.name !== null;

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
      return navigate("/projects");
    },
    [updateCurrentUser, createProject, currentUser, hasName, navigate]
  );

  useEffect(() => {
    if (projects && projects.length > 0) {
      navigate("/projects", { replace: true });
    }
  }, [projects, navigate]);

  if (isProjectsLoading) {
    return <LoadingOutlined />;
  }

  return (
    <Row justify="center">
      <Col span={10}>
        <Card
          title={
            <Typography.Title level={3} style={{ margin: 0 }}>
              Let's create your first project{" "}
              <span role="img" aria-label="emoji">
                🎉
              </span>
            </Typography.Title>
          }
        >
          <Form
            form={form}
            name="onboarding-form"
            onFinish={handleCreateProject}
          >
            <VerticalSpace style={{ width: "100%" }}>
              {!hasName && (
                <>
                  <Typography.Text style={{ padding: 0 }}>
                    What's your name?
                  </Typography.Text>
                  <Form.Item name="name">
                    <Input placeholder="John Doe" />
                  </Form.Item>
                </>
              )}

              <Row gutter={4} align="middle">
                <Col>
                  <Typography.Text>
                    How do you want to call your first project?
                  </Typography.Text>
                </Col>
              </Row>

              <Form.Item
                name="projectName"
                rules={[
                  {
                    required: true,
                    message: "You must enter a valid project name",
                  },
                ]}
              >
                <Input placeholder="e.g. Content Creation" />
              </Form.Item>
            </VerticalSpace>

            <Row justify="end">
              <StyledButton
                spacing={token.marginLG}
                htmlType="submit"
                loading={isCreatingProject}
              >
                Create Project <ArrowRightOutlined />
              </StyledButton>
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};
