import {
  useContext,
  type Context as ReactContext,
  type ReactNode,
} from 'react';

export type CombineContextItem<Value = unknown> = [Value, ReactContext<Value>];

export type CombineContextArray<Values extends unknown[]> = Values extends []
  ? []
  : Values extends [infer V, ...infer RVs]
    ? [CombineContextItem<V>, ...CombineContextArray<RVs>]
    : never;

export const createCombineContainer = <T extends unknown[]>(
  ...Contexts: CombineContextArray<T>
) => {
  function CombinedProvider({ children }: { children: ReactNode }) {
    let selectProviders: ReactNode = children;

    for (let i = 0; i < Contexts.length; i++) {
      const [value, Context] = Contexts[i] as CombineContextItem;

      selectProviders = (
        <Context.Provider value={value}>{selectProviders}</Context.Provider>
      );
    }

    return <>{selectProviders}</>;
  }

  const useHooks = (Contexts as CombineContextItem[]).map(([_, Context]) => {
    return () => useContext(Context);
  });

  return [CombinedProvider, useHooks] as const;
};
