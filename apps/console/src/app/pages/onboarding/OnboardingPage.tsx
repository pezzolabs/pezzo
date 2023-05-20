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
import { Navigate } from "react-router-dom";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import styled from "@emotion/styled";
import { useGetCurrentUser, useGetProjects } from "../../lib/hooks/queries";

const StyledButton = styled(Button)<{ spacing: number }>`
  margin-top: ${(props) => props.spacing}px;
`;

const VerticalSpace = styled(Space)`
  width: 100%;
`;
VerticalSpace.defaultProps = {
  direction: "vertical",
};

export const OnboardingPage = () => {
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

  if (isProjectsLoading || isCurrentUserLoading) {
    return <LoadingOutlined />;
  }

  const hasProjects = projectsData?.projects.length > 0;
  const currentUser = currentUserData?.me;
  const hasName = currentUser?.name;

  if (hasProjects) {
    return <Navigate to="/prompts" />;
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
      footer={
        <StyledButton spacing={token.marginLG}>
          Create a project <ArrowRightOutlined />
        </StyledButton>
      }
    >
      <VerticalSpace
        style={{ width: "100%", marginTop: token.marginLG }}
        size="large"
      >
        {!hasName && (
          <VerticalSpace>
            <Typography.Text>What's your name?</Typography.Text>
            <Input placeholder="John Doe" />
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
                <Button type="text" icon={<InfoCircleFilled />} />
              </Col>
            </Tooltip>
          </Row>

          <Input placeholder="Content Creation" />
        </VerticalSpace>
      </VerticalSpace>
    </Modal>
  );
};
