import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { Card, Col, Row, Typography } from "antd";
import { css } from "@emotion/css";
import { getIntegration } from "@pezzo/integrations";

interface Props {
  name: string;
  integrationId: string;
  onClick: () => void;
}

export const PromptListItem = ({ name, integrationId, onClick }: Props) => {
  const integration = getIntegration(integrationId);

  return (
    <Card hoverable={true} onClick={onClick} size="small">
      <Row gutter={[12, 12]} align="middle">
        <Col flex="60px">
          <div
            className={css`
              width: 46px;
              margin: auto;
            `}
          >
            <img
              src={integration.iconBase64}
              alt={integration.name}
              style={{ width: "100%", height: "100%", borderRadius: 6 }}
            />
          </div>
        </Col>
        <Col flex="auto">
          <Typography.Text style={{ fontSize: 18, fontWeight: 400 }}>
            {name}
          </Typography.Text>
        </Col>
        <Col
          flex="100px"
          className={css`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <ArrowRightCircleIcon opacity={0.5} height={24} />
        </Col>
      </Row>
    </Card>
  );
};
