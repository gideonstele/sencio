import {
  createContext,
  memo as ReactMemo,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from 'react';

export type ProviderProps<Props extends object> = {
  params?: Props;
  children?: ReactNode;
};

export type UseHook<Value, Props extends object> =
  | ((props: Props) => Value)
  | (() => Value);

export interface ContainerConsumerProps<Value> {
  children: (value: Value) => ReactNode;
}

export interface CreateContainerOptions<Value> {
  strict?: boolean;
  memo?: boolean;
  defaultValue?: Value | EmptyType;
}

const EMPTY: unique symbol = Symbol();

type EmptyType = typeof EMPTY;

export function createContainer<Value, Props extends object>(
  createFn: UseHook<Value, Props>,
  options: CreateContainerOptions<Value> = {},
) {
  const strict = options.strict || false;
  const memo = typeof options.memo === 'undefined' ? true : options.memo;
  const defaultValue = (
    typeof options.memo === 'undefined' ? EMPTY : options.defaultValue
  ) as Value | typeof EMPTY;

  const Context = createContext<Value | EmptyType>(defaultValue);
  const hookName = createFn.name || 'useHook';
  Context.displayName = `${hookName}Context`;

  function Provider({ params, children }: ProviderProps<Props>) {
    const value = createFn(params || ({} as Props));
    return (
      <Context.Provider value={value || defaultValue}>
        {children}
      </Context.Provider>
    );
  }

  function useContainer() {
    const isMounted = useRef(false);
    const value = useContext(Context);

    useEffect(() => {
      if (value === EMPTY) {
        if (isMounted.current && strict) {
          throw new Error(
            `${hookName} You should pass a default value when create the provider.`,
          );
        }
        isMounted.current = true;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return value as Value;
  }

  function Consumer({ children }: ContainerConsumerProps<Value>) {
    return (
      <Context.Consumer>
        {value => {
          if (value === EMPTY && strict) {
            throw new Error(
              'You should pass a default value when create the provider.',
            );
          }
          return children?.(value as Value);
        }}
      </Context.Consumer>
    );
  }

  return {
    Provider: memo ? ReactMemo(Provider) : Provider,
    Consumer,
    useContainer,
  };
}
