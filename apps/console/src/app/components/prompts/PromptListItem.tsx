import { ArrowRightCircleIcon, CubeIcon } from "@heroicons/react/24/outline";
import { Card, Col, Row, Tag, Typography } from "antd";
import { css } from "@emotion/css";
import { colorPrimary } from "../../lib/theme/ant-theme";
import Icon from "@ant-design/icons/lib/components/Icon";

interface Props {
  name: string;
  onClick: () => void;
  isDraft: boolean;
}

export const PromptListItem = ({ name, isDraft, onClick }: Props) => {
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
            {name} {isDraft && <Tag>Draft</Tag>}
          </Typography.Text>
        </Col>
        <Col
          flex="100px"
          className={css`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <Icon
            component={() => <ArrowRightCircleIcon height={24} opacity={0.5} />}
          />
        </Col>
      </Row>
    </Card>
  );
};
