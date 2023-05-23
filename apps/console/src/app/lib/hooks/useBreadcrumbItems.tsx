import { Link, useLocation, useParams } from "react-router-dom";
import { useGetProjects } from "./queries";
import React, { useMemo } from "react";
import { useCurrentPrompt } from "../providers/CurrentPromptContext";
import { Col, Row, Typography } from "antd";
import { IntegrationDefinition } from "@pezzo/integrations";
import { GetPromptQuery } from "@pezzo/graphql";

const breadcrumbNameMap = (
  projectId: string,
  projectName: string,
  prompt?: GetPromptQuery["prompt"],
  integration?: IntegrationDefinition
) => {
  const map: Record<string, string | React.ReactNode> = {
    "/projects": "Projects",
    [`/projects/${projectId}`]: `${projectName}`,
    [`/projects/${projectId}/prompts`]: `Prompts`,
    [`/projects/${projectId}/environments`]: "Environments",
    [`/projects/${projectId}/api-keys`]: "API Keys",
    [`/projects/${projectId}/info`]: "Info",
  };
  if (prompt && integration) {
    map[`/projects/${projectId}/prompts/${prompt.id}`] = (
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
    );
  }

  return map;
};

export const useBreadcrumbItems = () => {
  const location = useLocation();
  const { projectId } = useParams();
  const { data } = useGetProjects();
  const { prompt, integration } = useCurrentPrompt();

  const currentProject = useMemo(
    () => data?.projects.find((p) => p.id === projectId),
    [data, projectId]
  );

  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const extraBreadcrumbItems =
    projectId && data
      ? pathSnippets.map((_, index) => {
          const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
          const selectedBreadcrumb = breadcrumbNameMap(
            projectId,
            currentProject.name,
            prompt,
            integration
          )[url];

          return {
            key: url,
            title:
              index === pathSnippets.length - 1 ? (
                selectedBreadcrumb
              ) : (
                <Link
                  to={url === `/projects/${projectId}` ? `${url}/prompts` : url}
                >
                  {selectedBreadcrumb}
                </Link>
              ),
          };
        })
      : [];

  const breadcrumbItems = projectId
    ? extraBreadcrumbItems
    : [
        {
          title: "Projects",
          key: "projects",
        },
      ];

  if (breadcrumbItems.length === 1) return [];

  return breadcrumbItems;
};
