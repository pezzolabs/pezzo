// import { version } from "@pezzo/common";
import { Typography } from "antd";

export const InfoPage = () => {
  return (
    <Typography.Paragraph style={{ marginBottom: 40 }}>
      <Typography.Title>Info</Typography.Title>
      <Typography.Text style={{ fontWeight: "bold", marginRight: 10 }}>
        Version:
      </Typography.Text>
    </Typography.Paragraph>
  );
};
