import { ThemeConfig, theme } from "antd";
import { colors } from "./colors";

export const colorPrimary = colors["emerald"]["500"];
export const colorError = colors["red"]["500"];
export const colorSuccess = colors["emerald"]["500"];
export const colorInfo = colors["sky"]["500"];

export const antTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    fontFamily: "Inter",
    colorPrimary,
    colorError,
    colorSuccess,
    colorInfo,
  },
  components: {
    Typography: {
      fontWeightStrong: 400,
    },
    Tabs: {
      fontFamily: "Brockmann",
    },
    Button: {
      fontFamily: "Brockmann",
    },
    Layout: {
      colorBgHeader: "#141414",
    },
  },
};
