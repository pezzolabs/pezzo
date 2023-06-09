import { useCopyToClipboard } from "usehooks-ts";
import styled from "@emotion/styled";
import { Button, Card, Col, Row, Typography } from "antd";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";

const APIKeyContainer = styled.div`
  display: flex;
  align-items: center;
`;

interface Props {
  value: string;
}

export const PezzoApiKeyListItem = ({ value }: Props) => {
  const [copied, copy] = useCopyToClipboard();

  return (
    <Card size="small" key={value}>
      <APIKeyContainer>
        <Row align="middle">
          <Col
            flex={"90%"}
            style={{
              fontFamily: "Roboto Mono",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <Typography.Text style={{ fontFamily: "Roboto Mono" }}>
              {value}
            </Typography.Text>
          </Col>
          <Col
            flex="10%"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            {!copied ? (
              <Button
                onClick={() => copy(value)}
                icon={<CopyOutlined height={18} />}
              />
            ) : (
              <Button disabled icon={<CheckOutlined height={18} />} />
            )}
          </Col>
        </Row>
      </APIKeyContainer>
    </Card>
  );
};
