const regex = /\{([\w\s]+)\}/g;

export function findVariables(text: string): string[] {
  const matches = text.match(regex);
  const foundVariables = matches
    ? matches.map((match) => match.replace(/[{}]/g, ""))
    : [];
  return Array.from(new Set(foundVariables));
}
