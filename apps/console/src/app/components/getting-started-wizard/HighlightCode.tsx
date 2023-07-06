import { Highlight, themes } from "prism-react-renderer";

export const HighlightCode = ({ code }) => (
  <Highlight theme={themes.vsDark} code={code} language="ts">
    {({ style, tokens, getLineProps, getTokenProps }) => (
      <pre
        style={{
          ...style,
          background: "#000",
          padding: 14,
          borderRadius: 6,
        }}
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
