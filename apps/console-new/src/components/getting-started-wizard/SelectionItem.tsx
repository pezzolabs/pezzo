import { Card, Image, Space, Typography } from "antd";
import { colors } from "../../lib/theme/colors";

interface Props {
  logo?: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export const SelectionItem = ({ logo, label, selected, onClick }: Props) => {
  return (
    <Card
      size="small"
      style={{
        minWidth: 200,
        border: selected ? `1px solid ${colors.neutral[500]}` : undefined,
      }}
      hoverable
      onClick={onClick}
    >
      <Space direction="horizontal" size="large" style={{ display: "flex" }}>
        {logo && <Image style={{ width: 26, borderRadius: 4 }} src={logo} />}
        <Typography.Text>{label}</Typography.Text>
      </Space>
    </Card>
  );
};
