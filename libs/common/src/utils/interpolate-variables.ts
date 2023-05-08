export function interpolateVariables(
  text: string,
  variables: Record<string, boolean | number | string>
): string {
  return text.replace(/{{\s*(\w+)\s*}}/g, (match, key) =>
    // eslint-disable-next-line no-prototype-builtins
    variables.hasOwnProperty(key) ? String(variables[key]) : match
  );
}
