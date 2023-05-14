import { version } from "@pezzo/common";
import { Typography } from "antd";
import { InlineCodeSnippet } from "../components/common/InlineCodeSnippet";

export const InfoPage = () => {
  return (
    <>
      <Typography.Paragraph style={{ marginBottom: 40 }}>
        <Typography.Title>Info</Typography.Title>
        <Typography.Text style={{ fontWeight: "bold", marginRight: 10 }}>
          Version:
        </Typography.Text>
        <InlineCodeSnippet>{version}</InlineCodeSnippet>
      </Typography.Paragraph>

      <Typography.Paragraph>
        <Typography.Title>Disclaimer</Typography.Title>
        <Typography.Text>
          Pezzo is still in early development (Alpha) and may be unstable. The
          API may change at any time. Use at your own risk.
        </Typography.Text>
      </Typography.Paragraph>
    </>
  );
};
