import { createContext, memo, useContext, useEffect, useRef } from 'react';
import {
  UseCreateFn,
  CreateContainerOptions,
  ProviderProps,
  ContainerConsumerProps,
} from '../type';
import { EMPTY, EmptyType } from './utils';

export function createContainer<Value, Props extends Record<string, any>>(
  createFn: UseCreateFn<Value, Props>,
  options: CreateContainerOptions<Value> = {},
) {
  const strict = options.strict || false;
  const isMemo = typeof options.memo === 'undefined' ? true : options.memo;
  const defaultValue = (
    typeof options.memo === 'undefined' ? EMPTY : options.defaultValue
  ) as Value | typeof EMPTY;

  const Context = createContext<Value | EmptyType>(defaultValue);
  const displayName = createFn.name || 'CreateFn';
  Context.displayName = `${displayName}Context`;

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
            `${displayName} You should pass a default value when create the provider.`,
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
    Provider: isMemo ? memo(Provider) : Provider,
    Consumer,
    useContainer,
  };
}
