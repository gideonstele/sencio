import { ReactNode, createContext, useContext, useMemo } from 'react';

export type StateProvider<State> = (props: {
  children?: ReactNode;
  value?: State;
}) => ReactNode;

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

  const Provider: StateProvider<State> = ({ children, value }) => {
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
