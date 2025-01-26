/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';

export type ProviderProps<Props extends Record<string, any>> = {
  params?: Props;
  children?: ReactNode;
};

export type UseCreateFn<Value, Props extends Record<string, any>> =
  | ((props: Props) => Value)
  | (() => Value);

export interface CreateContainerOptions<Value> {
  providerRequired?: boolean;
  memo?: boolean;
  fallbackValue?: Value;
}

export interface ContainerConsumerProps<Value> {
  children: (value: Value) => ReactNode;
}

export interface ContainerConsumerProps<Value> {
  children: (value: Value) => ReactNode;
}

export type ContainerConsumer<Value> = (
  props: ContainerConsumerProps<Value>,
) => ReactNode;

export type SelectorHook<Result = any> = () => Result;

export type SelectorHookTuples<Selectors> = {
  [K in keyof Selectors]: () => Selectors[K] extends (...args: any) => infer R
    ? R
    : never;
};

export type SelectFn<Value, Result = unknown> = (value: Value) => Result;

export type SelectFnArray<
  Param,
  Results extends [...unknown[]],
> = Results['length'] extends 0
  ? []
  : Results extends [infer R, ...infer Rest]
    ? [SelectFn<Param, R>, ...SelectFnArray<Param, Rest>]
    : never;

export type ContainerProvider<Value extends Record<string, any> = {}> = (
  props: ProviderProps<Value>,
) => JSX.Element;
