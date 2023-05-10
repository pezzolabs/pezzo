import styled from "@emotion/styled";

const StyledSpan = styled("span")`
  padding: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-family: "Roboto Mono";
`;

export const InlineCodeSnippet = ({ children }) => {
  return <StyledSpan>{children}</StyledSpan>;
};
