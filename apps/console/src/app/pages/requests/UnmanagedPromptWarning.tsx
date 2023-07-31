import { WarningOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import colors from "tailwindcss/colors";

export const UnmanagedPromptWarning = () => {
  return (
    <Popover content={<>This prompt is not managed by Pezzo</>}>
      <WarningOutlined style={{ color: colors.yellow[500], fontSize: 16 }} />
    </Popover>
  );
};
