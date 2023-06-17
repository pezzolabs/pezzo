import { ThemeConfig, theme } from "antd";
import { colors } from "./colors";

export const antTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: colors.indigo["400"],
    fontFamily: "Inter",
  },
  components: {
    Typography: {
      fontWeightStrong: 400,
    },
  },
};
