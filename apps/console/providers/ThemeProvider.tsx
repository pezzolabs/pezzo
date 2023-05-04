import { ConfigProvider } from "antd";
import { antTheme } from "../lib/theme/ant-theme"; 

export const ThemeProvider = ({ children }) => (
  <ConfigProvider theme={antTheme}>{children}</ConfigProvider>
);
