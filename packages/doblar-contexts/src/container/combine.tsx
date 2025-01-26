import { type Context as ReactContext, type ReactNode } from 'react';

import { createUseFn } from './utils';

export type CombineContextContainerItem<Value = unknown> = [
  Value,
  ReactContext<Value>,
];

export type CombineContextContainerArray<Values extends unknown[]> =
  Values extends []
    ? []
    : Values extends [infer V, ...infer RVs]
      ? [CombineContextContainerItem<V>, ...CombineContextContainerArray<RVs>]
      : never;

export type ContextTuple<Values extends unknown[]> = Values extends []
  ? []
  : Values extends [infer V, ...infer RVs]
    ? [ReactContext<V>, ...ContextTuple<RVs>]
    : never;

export const createCombineContainer = <T extends unknown[]>(
  Contexts: CombineContextContainerArray<T>,
) => {
  function CombinedProvider({ children }: { children: ReactNode }) {
    let selectProviders: ReactNode = children;

    for (let i = 0; i < Contexts.length; i++) {
      const [value, Context] = Contexts[i] as CombineContextContainerItem;

      selectProviders = (
        <Context.Provider value={value}>{selectProviders}</Context.Provider>
      );
    }

    return <>{selectProviders}</>;
  }

  const useHooks = (Contexts as CombineContextContainerItem[]).map(
    ([_, Context]) => createUseFn(Context, true),
  );

  return [CombinedProvider, useHooks] as const;
};

export const createCombineProvider = <T extends unknown[]>(
  Contexts: ContextTuple<T>,
) => {
  function CombinedProvider({
    children,
    values,
  }: {
    children?: ReactNode;
    values?: T;
  }) {
    let selectProviders: ReactNode = children;

    for (let i = 0; i < Contexts.length; i++) {
      const Context = Contexts[i] as ReactContext<unknown>;

      selectProviders = (
        <Context.Provider value={values?.[i]}>
          {selectProviders}
        </Context.Provider>
      );
    }

    return <>{selectProviders}</>;
  }

  return CombinedProvider;
};
