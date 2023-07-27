import {
  Context,
  ReactElement,
  ReactNode,
  memo,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {
  UseCreateFn,
  CreateContainerOptions,
  ProviderProps,
  ContainerConsumerProps,
  SelectorHook,
  Selector,
} from '../type';
import { EMPTY, EmptyType, createContext, createUseFn } from './utils';

export function createContainer<
  Value,
  Props extends Record<string, any>,
  S extends Selector<Value>[],
>(
  useCreateValue: UseCreateFn<Value, Props>,
  selectors: S = [] as unknown as S,
  options: CreateContainerOptions<Value> = {},
) {
  const strict = options.strict || false;
  const isMemo = typeof options.memo === 'undefined' ? true : options.memo;
  const defaultValue = (
    typeof options.memo === 'undefined' ? EMPTY : options.defaultValue
  ) as Value | typeof EMPTY;

  const RootContext = createContext<Value | EmptyType>(defaultValue);

  const useValue = createUseFn(RootContext, strict);

  const Contexts = [] as Context<any>[];

  const hooks = [] as SelectorHook<any>[];

  selectors.forEach(selector => {
    const context = createContext(EMPTY, selector.name || 'Selector');
    Contexts.push(context);
    hooks.push(createUseFn(context, strict));
  });

  function Provider({ params, children }: ProviderProps<Props>) {
    const value = useCreateValue(params || ({} as Props));

    let cascadeProviders: ReactNode = children;

    for (let i = 0; i < Contexts.length; i++) {
      const Ctx = Contexts[i];
      const selector = selectors[i] || (v => v);

      cascadeProviders = (
        <Ctx.Provider value={selector(value)}>{cascadeProviders}</Ctx.Provider>
      );
    }

    return (
      <RootContext.Provider value={value || defaultValue}>
        {cascadeProviders}
      </RootContext.Provider>
    );
  }

  function Consumer({ children }: ContainerConsumerProps<Value>) {
    return (
      <RootContext.Consumer>
        {value => {
          if (value === EMPTY && strict) {
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

  return [MemoProvider, useValue, Consumer, ...hooks] as const;
}
