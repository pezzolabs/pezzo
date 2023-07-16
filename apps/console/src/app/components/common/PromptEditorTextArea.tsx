import TextArea from "antd/es/input/TextArea";
import styled from "@emotion/styled";
import { colors } from "../../lib/theme/colors";

export const PromptEditorTextArea = styled(TextArea)`
  resize: none !important;
  border: none;
  background: transparent;
  outline: none;
  color: ${colors.neutral["200"]};

  ::placeholder {
    color: ${colors.neutral["500"]};
  }
`;
