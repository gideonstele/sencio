import {
  createContext,
  memo,
  useContext,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

import { CreateContainerOptions, HookFnContainer, UseIt } from './type';

const DEFAULT_FALLBACK_VALUE = Symbol('DEFAULT_FALLBACK_VALUE');

export function createContextContainer<
  Params extends object = object,
  ReturnValue = unknown,
>(
  useContainer: HookFnContainer<Params, ReturnValue>,
  options?: CreateContainerOptions<ReturnValue>,
) {
  // 处理默认配置
  const providerWrapperRequired = options?.providerWrapperRequired ?? true;
  const memoize = options?.memoize ?? true;
  const fallbackValue = options?.fallbackValue;

  // 创建 Context
  const Context = createContext<ReturnValue | undefined>(
    DEFAULT_FALLBACK_VALUE as ReturnValue,
  );
  Context.displayName = `ContextContainer(${useContainer.name})`;

  // 创建 Provider
  function Provider({ children, ...params }: PropsWithChildren<Params>) {
    const value = useContainer((params || {}) as Params);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  // 创建 useContainer 钩子
  const useIt: UseIt<ReturnValue> = () => {
    const value = useContext(Context);
    if (providerWrapperRequired && value === DEFAULT_FALLBACK_VALUE) {
      throw new Error('useContainer must be used within a Provider');
    }
    return value ?? fallbackValue;
  };

  useIt.Context = Context;

  const ProviderIt = memoize ? memo(Provider) : Provider;

  return [ProviderIt, useIt] as [
    (props: PropsWithChildren<Params>) => ReactNode,
    () => ReturnValue,
  ];
}
