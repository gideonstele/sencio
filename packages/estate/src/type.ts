import { ReactNode } from 'react';
import { EmptyType } from './container/utils';

export type ProviderProps<Props extends Record<string, any>> = {
  params?: Props;
  children?: ReactNode;
};

export type UseCreateFn<Value, Props extends Record<string, any>> =
  | ((props: Props) => Value)
  | (() => Value);

export interface CreateContainerOptions<Value> {
  strict?: boolean;
  memo?: boolean;
  defaultValue?: Value | EmptyType;
}

export interface ContainerConsumerProps<Value> {
  children: (value: Value) => ReactNode;
}

export interface ContainerConsumerProps<Value> {
  children: (value: Value) => ReactNode;
}

export type Selector<Value, Result = any> = (value: Value) => Result;

export type SelectorHook<Result = any> = () => Result;

export type SelectHooks<Selectors> = {
  [K in keyof Selectors]: () => Selectors[K] extends (...args: any) => infer R
    ? R
    : never;
};
