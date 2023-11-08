import { Highlight, themes } from "prism-react-renderer";
import { StyledPre } from "./StyledPre";

type Props = {
  code: string;
  language: string;
};

export const HighlightCode = ({ code, language = "ts" }: Props) => (
  <Highlight theme={themes.vsDark} code={code} language={language}>
    {({ style, tokens, getLineProps, getTokenProps }) => (
      <StyledPre
        style={{
          ...style,
          background: "#000",
        }}
      >
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line })}>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token })} />
            ))}
          </div>
        ))}
      </StyledPre>
    )}
  </Highlight>
);
