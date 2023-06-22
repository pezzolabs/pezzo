// GENERIC TS HELPERS
export type Tail<T extends unknown[]> = T extends [infer Head, ...infer Tail]
  ? Tail
  : never;

// SPECIFIC PEZZO HELPERS
export interface PezzoArgInTappedFn {
  prompt: {
    id: string;
    sha: string;
    variables?: Record<string, unknown>;
    content: string;
    interpolatedContent: string;
  };
}

export type PezzoExtendedArg<TArgs extends unknown[]> = TArgs[0] & {
  pezzo: PezzoArgInTappedFn;
};

export type PezzoExtendedArgs<TArgs extends unknown[]> = [
  PezzoExtendedArg<TArgs>,
  ...Tail<TArgs>
];
