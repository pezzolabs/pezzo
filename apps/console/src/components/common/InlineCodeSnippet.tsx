export const InlineCodeSnippet = ({ children }) => {
  return (
    <div className="inline-block rounded-sm bg-foreground/10 p-1 font-mono">
      {children}
    </div>
  );
};
