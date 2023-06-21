import CodeMirror from "@uiw/react-codemirror";
import { materialInit } from "@uiw/codemirror-theme-material";
import { css } from "@emotion/css";
import { colors } from "../../lib/theme/colors";
import { Form } from "antd";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

export const PromptEditor = ({ value, onChange }: Props) => {
  return (
    <Form.Item name="content">
      <CodeMirror
        onChange={onChange}
        placeholder="Start typing your prompt here..."
        className={css`
          .cm-content {
            white-space: pre-wrap !important;
          }
          .cm-selectionBackground {
            background: ${colors.slate["400"]} !important;
          }
        `}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          autocompletion: false,
          crosshairCursor: false,
          highlightActiveLine: false,
          highlightSelectionMatches: false,
        }}
        extensions={[]}
        theme={materialInit({
          settings: {
            fontFamily: "Roboto Mono",
            lineHighlight: "red",
            background: "transparent",
          },
        })}
        value={value}
        height="400px"
      />
    </Form.Item>
  );
};
