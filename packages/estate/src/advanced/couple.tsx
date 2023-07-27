import { EMPTY, EmptyType } from '../container/utils';
import { createContext, useContext, useEffect, useRef, memo } from 'react';
import {
  ContainerConsumerProps,
  ProviderProps,
  CreateContainerOptions,
} from '../type';

export type Dispatch<Value> = (prev: Value) => Value;

export type CoupleItem<Value> = [Value, Dispatch<Value>];

export type CreateCoupleFn<Value, Props extends object> =
  | ((props: Props) => CoupleItem<Value | EmptyType>)
  | (() => CoupleItem<Value | EmptyType>);

export type CreateCoupleOption<Value> = CreateContainerOptions<Value>;

export function createDualContainer<Value, Props extends Record<string, any>>(
  useCoupleFn: CreateCoupleFn<Value, Props>,
  options: CreateCoupleOption<Value> = {},
) {
  const strict = options.strict || false;
  const isMemo = typeof options.memo === 'undefined' ? true : options.memo;
  const defaultValue = (
    typeof options.memo === 'undefined' ? EMPTY : options.defaultValue
  ) as Value | EmptyType;

  const ValueContext = createContext<Value | EmptyType>(defaultValue);
  const DispatchContext = createContext<Dispatch<Value | EmptyType>>(
    () => defaultValue,
  );

  const name = useCoupleFn.name || 'DualContainer';

  ValueContext.displayName = `${name}Value`;
  DispatchContext.displayName = `${name}Dispatch`;

  const DispatchProvider = isMemo
    ? memo(DispatchContext.Provider)
    : DispatchContext.Provider;
  const ValueProvider = isMemo
    ? memo(ValueContext.Provider)
    : ValueContext.Provider;

  function Provider({ params, children }: ProviderProps<Props>) {
    const [value, dispatch] = useCoupleFn(params || ({} as Props));

    return (
      <DispatchProvider value={dispatch}>
        <ValueProvider value={value}>{children}</ValueProvider>
      </DispatchProvider>
    );
  }

  function useValue() {
    const isMounted = useRef(false);

    const value = useContext(ValueContext);

    useEffect(() => {
      if (value === EMPTY) {
        if (isMounted.current && strict) {
          throw new Error(
            `${ValueContext.displayName}: You should pass a default value when create the provider.`,
          );
        }
        isMounted.current = true;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return value as Value;
  }

  function useDispatch() {
    return useContext(DispatchContext) as Dispatch<Value>;
  }

  function useContainer() {
    return [useValue(), useDispatch()] as CoupleItem<Value>;
  }

  function Consumer({ children }: ContainerConsumerProps<Value>) {
    return (
      <ValueContext.Consumer>
        {value => {
          if (value === EMPTY && strict) {
            throw new Error(
              `${ValueContext.displayName}: You should pass a default value when create the provider.`,
            );
          }
          return children?.(value as Value);
        }}
      </ValueContext.Consumer>
    );
  }

  return {
    Provider: isMemo ? memo(Provider) : Provider,
    useValue,
    useDispatch,
    useContainer,
    Consumer,
  };
}
