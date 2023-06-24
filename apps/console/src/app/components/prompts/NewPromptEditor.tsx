import CodeMirror from "@uiw/react-codemirror";
import { materialInit } from "@uiw/codemirror-theme-material";
import { css } from "@emotion/css";
import { colors } from "../../lib/theme/colors";
import { Form } from "antd";
import Editor from "@monaco-editor/react";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

export const NewPromptEditor = ({ value, onChange }: Props) => {
  return (
    <Form.Item name="settings">
      <Editor
        theme="vs-dark"
        height="400px"
        defaultLanguage="json"
        defaultValue={value}
        onChange={onChange}
      />
    </Form.Item>
  );
};
