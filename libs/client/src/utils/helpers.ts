import {
  PezzoInjectedContext,
  PezzoExtendedArgs,
} from "../types/helpers";

interface ExtractedPezzoFromArgsResult<TArgs extends unknown[]> {
  _pezzo: PezzoInjectedContext;
  originalArgs: TArgs;
}

export const extractPezzoFromArgs = <TArgs extends unknown[]>(
  args: PezzoExtendedArgs<TArgs>
): ExtractedPezzoFromArgsResult<TArgs> => {
  const { _pezzo, ...originalArgs0 } = args[0];
  return {
    _pezzo,
    originalArgs: [originalArgs0, ...args.slice(1)] as TArgs,
  };
};
