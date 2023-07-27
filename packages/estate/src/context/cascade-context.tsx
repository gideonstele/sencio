import { ReactNode, createContext, useContext, useMemo } from 'react';

export type StateProvider<State> = (props: {
  children?: ReactNode;
  value?: State;
}) => ReactNode;

export interface CascadeContextOption {
  noNesting?: boolean;
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
    if (useContext(NestingCheckerContext) && option?.noNesting) {
      throw new Error('CascadeContext cannot be nested.');
    }

    const initialValue = useContext(StateContext);
    const state = useMemo(() => {
      if (typeof value === 'undefined') {
        return initialValue;
      }

      if (typeof value === 'object') {
        return {
          ...initialValue,
          ...value,
        };
      }

      return value;
    }, [initialValue, value]);

    return (
      <NestingCheckerContext.Provider value>
        <StateContext.Provider value={state}>{children}</StateContext.Provider>
      </NestingCheckerContext.Provider>
    );
  };

  const useValue = () => useContext(StateContext);

  return [Provider, useValue] as const;
};
