export const StyledPre = ({ children, style = {} }) => {
  return (
    <pre className="bg-black p-4 rounded-md w-full overflow-x-auto" style={{ ...style }}>
      {children}
    </pre>
  )
}