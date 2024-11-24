/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmptyType } from './container/utils';
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
  defaultValue?: Value | EmptyType;
}

export interface ContainerConsumerProps<Value> {
  children: (value: Value) => ReactNode;
}

export interface ContainerConsumerProps<Value> {
  children: (value: Value) => ReactNode;
}

export type SelectFn<Value, Result = unknown> = (value: Value) => Result;

export type SelectorHook<Result = any> = () => Result;

export type SelectHooks<Selectors> = {
  [K in keyof Selectors]: () => Selectors[K] extends (...args: any) => infer R
    ? R
    : never;
};

/**
 * @source https://github.com/ramda/types/blob/13d36d597c51793627a7b0dc0d83c62f1236029b/types/util/tools.d.ts#L441
 * A homogeneous tuple of length `N`.
 * @param T Type of every element of the tuple
 * @param N Length of the tuple
 */
export type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

export type SelectFnArray<Param, Results extends unknown[]> = Results extends []
  ? []
  : Results extends [infer R, ...infer Rs]
    ? [SelectFn<Param, R>, ...SelectFnArray<Param, Rs>]
    : never;
