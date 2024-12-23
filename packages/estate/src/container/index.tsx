/* eslint-disable @typescript-eslint/no-explicit-any  */
/*eslint-disable @typescript-eslint/no-empty-object-type */
import { memo, ReactNode } from 'react';
import {
  createCombineProvider,
  type CombineContextContainerArray,
} from 'container/combine';

import {
  ContainerConsumerProps,
  CreateContainerOptions,
  ProviderProps,
  SelectFn,
  SelectFnArray,
  SelectorHook,
  UseCreateFn,
} from '../type';
import { createContext, createUseFn, EMPTY, EmptyType } from './utils';

export function createContainer<
  Value,
  Props extends Record<string, any> = {},
  SelectFnResults extends unknown[] = [],
>(
  useCreateValue: UseCreateFn<Value, Props>,
  selectorFns?: SelectFnArray<Value, SelectFnResults>,
  options: CreateContainerOptions<Value> = {},
) {
  const providerRequired = options.providerRequired || false;
  const isMemo = typeof options.memo === 'undefined' ? true : options.memo;
  const fallbackValue = options.fallbackValue ?? EMPTY;

  const RootContext = createContext<Value | EmptyType>(fallbackValue);

  const useValue = createUseFn(RootContext, providerRequired) as () => Value;

  const useSelectors = [] as [...SelectorHook<SelectFnResults>[]];
  let SelectorsCombineProvider: (props: {
    children?: ReactNode;
    values?: any;
  }) => ReactNode = ({ children }: { children?: ReactNode }) => <>{children}</>;

  if (selectorFns && (selectorFns as any[]).length > 0) {
    const SelectorContexts = [] as any[];

    for (let i = 0; i < (selectorFns as any[]).length; i++) {
      const SelectorContext = createContext<unknown>(undefined);
      const hook = createUseFn(
        SelectorContext,
        providerRequired,
      ) as SelectorHook;
      SelectorContexts.push(SelectorContext);
      useSelectors.push(hook);
    }

    SelectorsCombineProvider = createCombineProvider(
      SelectorContexts as CombineContextContainerArray<SelectFnResults>,
    );
  }

  function Provider({ params, children }: ProviderProps<Props>) {
    const value = useCreateValue(params || ({} as Props));

    const selectors: SelectFnResults | undefined = (
      (selectorFns || []) as any[]
    ).map(fn => (fn as SelectFn<Value>)(value)) as SelectFnResults;

    return (
      <RootContext.Provider value={value || fallbackValue}>
        <SelectorsCombineProvider values={selectors}>
          {children}
        </SelectorsCombineProvider>
      </RootContext.Provider>
    );
  }

  function Consumer({ children }: ContainerConsumerProps<Value>) {
    return (
      <RootContext.Consumer>
        {value => {
          if (value === EMPTY && providerRequired) {
            throw new Error(
              'You should pass a default value when create the provider.',
            );
          }
          return children?.(value as Value);
        }}
      </RootContext.Consumer>
    );
  }

  const MemoProvider = (isMemo ? memo(Provider) : Provider) as (
    props: ProviderProps<Props>,
  ) => JSX.Element;

  return [MemoProvider, useValue, useSelectors, Consumer] as const;
}
