import { Highlight, themes } from "prism-react-renderer";

type Props = {
  code: string;
  language: string;
}

export const HighlightCode = ({ code, language = "ts" }: Props) => (
  <Highlight theme={themes.vsDark} code={code} language={language}>
    {({ style, tokens, getLineProps, getTokenProps }) => (
      <pre
        style={{
          ...style,
          background: "#000",
          padding: 14,
          borderRadius: 6,
        }}
        className="w-full overflow-x-auto"
      >
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line })}>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
);
