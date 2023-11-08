export const InlineCodeSnippet = ({ children }) => {
  return (
    <div className="p-1 inline-block bg-foreground/10 rounded-sm font-mono">
      {children}
    </div>
  )
};
