import { useLocation, matchPath, Link } from "react-router-dom";
import { paths } from "../../app";
import { useMemo } from "react";
import { Col, Row, Typography } from "antd";
import { useCurrentOrganization } from "./useCurrentOrganization";
import { useCurrentProject } from "./useCurrentProject";
import { useCurrentPrompt } from "../providers/CurrentPromptContext";

export const useBreadcrumbItems = () => {
  const location = useLocation();
  const { organization } = useCurrentOrganization();
  const { project } = useCurrentProject();
  const { prompt, integration } = useCurrentPrompt();

  const resolvers = useMemo(
    () => ({
      projects: {
        title: "Projects",
        link: `/orgs/${organization?.id}`,
      },
      ":projectId": {
        title: project?.name,
        link: `/projects/${project?.id}`,
      },
      overview: {
        title: "Overview",
        link: `/projects/${project?.id}/overview`,
      },
      environments: {
        title: "Environments",
        link: `/projects/${project?.id}/environments`,
      },
      requests: {
        title: "Requests",
        link: `/projects/${project?.id}/requests`,
      },
      prompts: {
        title: "Prompts",
        link: `/projects/${project?.id}/prompts`,
      },
      ":promptId": {
        title: prompt && integration && (
          <Row align="middle" gutter={8}>
            <Col>
              <img
                src={integration.iconBase64}
                width={20}
                height={20}
                style={{ borderRadius: 2 }}
                alt="prompt-icon"
              />
            </Col>
            <Col>
              <Typography.Text>{prompt.name}</Typography.Text>
            </Col>
          </Row>
        ),
        link: `/projects/${project?.id}/prompts/${prompt?.id}`,
      },
    }),
    [organization, project, prompt, integration]
  );

  const getBreadcrumbParts = () => {
    const matchingPath = Object.keys(paths).find((p) =>
      matchPath(p, location.pathname)
    );

    if (!matchingPath) return [];

    const matchingSplit = matchingPath.split("/").filter((i) => i);
    const parts: { title: string | React.ReactNode; key: string }[] = [];

    for (const [idx, item] of matchingSplit.entries()) {
      const resolvedBreadcrumb = resolvers[item];
      if (!resolvedBreadcrumb) continue;

      const isLastItem = idx === matchingSplit.length - 1;
      const { title, link } = resolvedBreadcrumb;

      parts.push({
        title: isLastItem ? title : <Link to={link}>{title}</Link>,
        key: `${title}_${link}`,
      });
    }

    return parts;
  };

  const parts = useMemo(getBreadcrumbParts, [location.pathname, resolvers]);

  return (
    organization && [
      {
        title: "Organizations",
        key: `/orgs`,
      },
      {
        title: (
          <Link to={`/orgs/${organization?.id}`} replace={true}>
            {organization.name}
          </Link>
        ),
        key: `/orgs/${organization?.id}`,
      },
      ...parts,
    ]
  );
};
