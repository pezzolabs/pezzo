import { PezzoInjectedContext, PezzoExtendedArgs } from "../types";

interface ExtractedPezzoFromArgsResult<TArgs extends unknown[]> {
  pezzo: PezzoInjectedContext;
  originalArgs: TArgs;
}

export const extractPezzoFromArgs = <TArgs extends unknown[]>(
  args: PezzoExtendedArgs<TArgs>
): ExtractedPezzoFromArgsResult<TArgs> => {
  const { pezzo, ...originalArgs0 } = args[0];

  return {
    pezzo,
    originalArgs: [originalArgs0, ...args.slice(1)] as TArgs,
  };
};

export const merge = <T extends Record<string, unknown>>(
  ...args: T[]
): T => {
  return args.reduce((acc, arg) => {
    return {
      ...acc,
      ...arg,
    };
  }, {} as T);
};


