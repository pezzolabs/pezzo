import { ThemeConfig, theme } from "antd";
import { colors } from "./colors";


export const antTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: colors["emerald"]["500"],
    colorError: colors["red"]["500"],
    colorSuccess: colors["emerald"]["500"],
    colorInfo: colors["sky"]["500"],
    fontFamily: "Inter",
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
      colorBgHeader: "#141414"
    }
  },
};
