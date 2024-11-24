import type { Dispatch, SetStateAction } from 'react';

import { createCombineContainer } from '../context/combine-context';
import { createContext } from './utils';

type DispatchAction<State> = Dispatch<SetStateAction<State>>;

export type StatePairContainerReturnItem<State> = [
  State,
  DispatchAction<State>,
];

export type UseStatePairFn<State> = () => StatePairContainerReturnItem<State>;

export type UseStatePairFnArray<Ss extends unknown[]> = Ss extends []
  ? []
  : Ss extends [infer R, ...infer Rs]
    ? [() => R, ...UseStatePairFnArray<Rs>]
    : never;

export type StatePairContainerReturn<States extends unknown[]> =
  States extends []
    ? []
    : States extends [infer State, ...infer RStates]
      ? [
          StatePairContainerReturnItem<State>,
          ...StatePairContainerReturn<RStates>,
        ]
      : never;

export function createStatePairContainer<State>(
  createValue: UseStatePairFn<State>,
) {
  const [value, setValue] = createValue();

  const ValueContext = createContext(value);
  const SetValueContext = createContext(setValue);

  const CombinedProvider = createCombineContainer<[State, typeof setValue]>(
    [value, ValueContext],
    [setValue, SetValueContext],
  );

  const useValue = () => value;
  const useSetValue = () => setValue;

  return [CombinedProvider, useValue, useSetValue] as const;
}
