import { createContext, ReactNode, useContext, useMemo } from 'react';

interface StateProviderProps<State> {
  children?: ReactNode;
  value?: State;
}

export type StateProvider<State> = (
  props: StateProviderProps<State>,
) => ReactNode;

export interface CascadeContextOption {
  disallowCascading?: boolean;
}

export const createCascadeContext = <State,>(
  initial: State | (() => State),
  option?: CascadeContextOption,
) => {
  const StateContext = createContext<State>(
    typeof initial === 'function' ? (initial as () => State)() : initial,
  );

  const NestingCheckerContext = createContext(false);

  const Provider: StateProvider<State> = ({
    children,
    value,
  }: StateProviderProps<State>) => {
    if (useContext(NestingCheckerContext) && option?.disallowCascading) {
      throw new Error('CascadeContext cannot be nested.');
    }

    const upperContextValue = useContext(StateContext);
    const state = useMemo(() => {
      if (typeof value === 'undefined') {
        return upperContextValue;
      }

      if (typeof value === 'object') {
        return {
          ...upperContextValue,
          ...value,
        };
      }

      return value;
    }, [upperContextValue, value]);

    return (
      <NestingCheckerContext.Provider value>
        <StateContext.Provider value={state}>{children}</StateContext.Provider>
      </NestingCheckerContext.Provider>
    );
  };

  const useValue = () => useContext(StateContext);

  return [Provider, useValue] as const;
};
