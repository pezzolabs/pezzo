import {
  PezzoArgInTappedFn,
  PezzoExtendedArg,
  PezzoExtendedArgs,
} from "../types/helpers";

interface ExtractedPezzoFromArgsResult<TArgs extends unknown[]> {
  pezzo: PezzoArgInTappedFn;
  trimmedArgs: TArgs;
}

export const extractPezzoFromArgs = <TArgs extends unknown[]>(
  args: PezzoExtendedArgs<TArgs>
): ExtractedPezzoFromArgsResult<TArgs> => {
  const initialAcc: ExtractedPezzoFromArgsResult<TArgs> = {
    pezzo: { prompt: { id: "", sha: "" } },
    trimmedArgs: [] as TArgs,
  };
  return args.reduce(
    (acc, currentValue): ExtractedPezzoFromArgsResult<TArgs> => {
      if (Object.keys(currentValue).includes("pezzo")) {
        const { pezzo, ...rest } = currentValue as PezzoExtendedArg<TArgs>;
        return {
          ...acc,
          pezzo,
          trimmedArgs: [...acc.trimmedArgs, rest] as TArgs,
        };
      }

      return {
        ...acc,
        trimmedArgs: [...acc.trimmedArgs, currentValue] as TArgs,
      };
    },
    initialAcc
  );
};
