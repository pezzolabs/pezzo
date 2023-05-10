import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { Card, Col, Row, Typography } from "antd";
import { css } from "@emotion/css";
import OpenAILogo from "../../assets/openai-logo-white.svg";
import Image from "next/image";

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
              background-color: #74aa9c;
              padding: 8px;
              border-radius: 6px;
            `}
          >
            <Image
              src={OpenAILogo}
              alt="OpenAI"
              style={{ width: "100%", height: "100%" }}
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
