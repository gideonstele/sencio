import {
  Context,
  createContext as createReactContext,
  useContext,
  useEffect,
} from 'react';
export const EMPTY: unique symbol = Symbol();
export type EmptyType = typeof EMPTY;

export const createContext = <Value,>(
  value: Value,
  displayName = 'AnyContext',
) => {
  const Context = createReactContext<Value>(value);
  Context.displayName = `${displayName}Context`;

  return Context;
};

export const createUseFn = <Value,>(
  context: Context<Value>,
  providerRequired = false,
) => {
  return () => {
    const value = useContext(context);

    if (value === EMPTY && providerRequired) {
      throw new Error(
        `You should wrap \`${context.displayName}\` as a provider before you consume the value.`,
      );
    }

    return value;
  };
};
