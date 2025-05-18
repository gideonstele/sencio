import {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import { createExternalContainer, ReactExternalStore } from 'external-store';

import { CreateContainerOptions, HookFnContainer } from './type';

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
  const fallbackValue = options?.fallbackValue;

  const [useValueByExternal, store] = createExternalContainer(
    fallbackValue,
    () => fallbackValue,
    options?.isEqual,
  );

  const storeFallback = Object.assign(store, {
    __DEFAULT_MARK: DEFAULT_FALLBACK_VALUE,
  });

  // 创建 Context
  const Context =
    createContext<ReactExternalStore<ReturnValue | undefined>>(storeFallback);
  Context.displayName = `ContextContainer(${useContainer.name})`;

  // 创建 Provider
  function Provider({ children, ...params }: PropsWithChildren<Params>) {
    const storeRef = useRef(store);
    const value = useContainer((params || {}) as Params);

    useEffect(() => {
      storeRef.current.update(value);
    }, [value]);

    return (
      <Context.Provider value={storeRef.current}>{children}</Context.Provider>
    );
  }

  const useSelector = <SelectedValue = ReturnValue,>(
    selector: (value?: ReturnValue) => SelectedValue = value =>
      value as SelectedValue,
  ) => {
    const store = useContext(Context);

    if (
      providerWrapperRequired &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (store as any).__DEFAULT_FALLBACK_VALUE === DEFAULT_FALLBACK_VALUE
    ) {
      throw new Error('useContainer must be used within a Provider');
    }

    const value = useValueByExternal(store, selector);

    return useMemo(() => value, [value]);
  };

  return [memo(Provider), useSelector] as [
    (props: PropsWithChildren<Params>) => ReactNode,
    <SelectedValue = ReturnValue>(
      selector?: (value?: ReturnValue) => SelectedValue,
    ) => SelectedValue,
  ];
}
