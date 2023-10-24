import { ConfigProvider } from "antd";
import { antTheme } from "../theme/ant-theme";

interface Props {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: Props) => (
  <ConfigProvider theme={antTheme}>{children}</ConfigProvider>
);
