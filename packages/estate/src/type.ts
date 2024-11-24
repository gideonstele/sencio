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

export type TupleIndices<T extends readonly any[]> =
  Extract<keyof T, `${number}`> extends `${infer N extends number}` ? N : never;

export type SelectFnArray<
  Fn extends SelectFn<any>,
  Results extends readonly any[],
> = {
  [Index in TupleIndices<Results>]: Fn extends SelectFn<infer Value, any>
    ? SelectFn<Value, Results[Index]>
    : never;
} & Array<SelectFn<any, any>>;
