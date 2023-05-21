import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { Card, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  name: string;
  slug: string;
  id: string;
}
export const ProjectCard = ({ name, slug, id }: ProjectCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      onClick={() => navigate(`/projects/${id}/prompts`)}
      style={{ marginBottom: 16, height: 122 }}
    >
      <Row justify="space-between" align="middle">
        <Typography.Title level={4} style={{ margin: 0 }}>
          {name}
        </Typography.Title>

        <ArrowRightCircleIcon opacity={0.5} height={24} />
      </Row>
    </Card>
  );
};
