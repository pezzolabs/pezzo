import { ArrowRightCircleIcon, CubeIcon } from "@heroicons/react/24/outline";
import { Card, Col, Row, Typography } from "antd";
import { css } from "@emotion/css";
import { colorPrimary } from "../../lib/theme/ant-theme";

interface Props {
  name: string;
  onClick: () => void;
}

export const PromptListItem = ({ name, onClick }: Props) => {
  return (
    <Card hoverable={true} onClick={onClick} size="small">
      <Row gutter={[12, 12]} align="middle">
        <Col flex="60px">
          <div
            className={css`
              width: 46px;
              margin: auto;
              padding: 4px;
            `}
          >
            <CubeIcon height={"80%"} width={"80%"} color={colorPrimary} />
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
