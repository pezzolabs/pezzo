export function interpolateVariables(
  text: string,
  variables: Record<string, boolean | number | string>
): string {
  return text.replace(/{\s*(\w+)\s*}/g, (match, key) =>
    // eslint-disable-next-line no-prototype-builtins
    variables.hasOwnProperty(key) ? String(variables[key]) : match
  );
}

export function interpolateVariablesRecursively<T>(
  obj: Record<string, any>,
  variables: Record<string, boolean | number | string>
): T {
  const processValue = (value: any): any => {
    if (typeof value === "string") {
      return value.replace(/{\s*(\w+)\s*}/g, (match, key) =>
        Object.prototype.hasOwnProperty.call(variables, key)
          ? String(variables[key])
          : match
      );
    } else if (Array.isArray(value)) {
      return value.map(processValue);
    } else if (typeof value === "object" && value !== null) {
      return processObj(value);
    } else {
      return value;
    }
  };

  const processObj = (object: Record<string, any>): Record<string, any> => {
    return Object.entries(object).reduce((newObject, [key, value]) => {
      newObject[key] = processValue(value);
      return newObject;
    }, {} as Record<string, any>);
  };

  return processValue(obj) as T;
}
