export const StyledPre = ({ children, style = {} }) => {
  return (
    <pre
      className="w-full overflow-x-auto rounded-md bg-black p-4"
      style={{ ...style }}
    >
      {children}
    </pre>
  );
};
