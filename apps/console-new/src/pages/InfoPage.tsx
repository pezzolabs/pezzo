import { Typography } from "antd";
import { usePageTitle } from "../lib/hooks/usePageTitle";

export const InfoPage = () => {
  usePageTitle("Info");
  return (
    <Typography.Paragraph style={{ marginBottom: 40 }}>
      <Typography.Title>Info</Typography.Title>
    </Typography.Paragraph>
  );
};
