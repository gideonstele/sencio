/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ContainerConsumerProps,
  CreateContainerOptions,
  ProviderProps,
  SelectFnArray,
  SelectorHook,
  UseCreateFn,
  type SelectFn,
} from '../type';
import { Context, ReactNode, memo } from 'react';
import { EMPTY, EmptyType, createContext, createUseFn } from './utils';

export function createContainer<
  Value,
  Props extends Record<string, any>,
  Results extends unknown[],
>(
  useCreateValue: UseCreateFn<Value, Props>,
  selectors: SelectFnArray<Value, Results>,
  options: CreateContainerOptions<Value> = {},
) {
  const providerRequired = options.providerRequired || false;
  const isMemo = typeof options.memo === 'undefined' ? true : options.memo;
  const defaultValue = (
    typeof options.memo === 'undefined' ? EMPTY : options.defaultValue
  ) as Value | typeof EMPTY;

  const RootContext = createContext<Value | EmptyType>(defaultValue);

  const useValue = createUseFn(RootContext, providerRequired) as () => Value;

  const Contexts = [] as Context<unknown>[];

  const hooks = [] as SelectorHook<unknown>[];

  selectors.forEach(selector => {
    const context = createContext(
      EMPTY,
      (selector as SelectFn<Value>).name || 'Selector',
    ) as unknown as Context<unknown>;
    Contexts.push(context);
    hooks.push(createUseFn(context, providerRequired));
  });

  function Provider({ params, children }: ProviderProps<Props>) {
    const value = useCreateValue(params || ({} as Props));

    let selectProviders: ReactNode = children;

    for (let i = 0; i < Contexts.length; i++) {
      const Ctx = Contexts[i];
      const selector = selectors[i];

      selectProviders = (
        <Ctx.Provider value={(selector as SelectFn<Value>)(value)}>
          {selectProviders}
        </Ctx.Provider>
      );
    }

    return (
      <RootContext.Provider value={value || defaultValue}>
        {selectProviders}
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

  const MemoProvider = isMemo ? memo(Provider) : Provider;

  return [MemoProvider, useValue, ...hooks, Consumer] as const;
}
