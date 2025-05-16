import { Context } from 'react';

export type HookFnContainer<Params extends object, ReturnValue> = (
  params: Params,
) => ReturnValue;

export interface CreateContainerOptions<ReturnValue> {
  providerWrapperRequired?: boolean;
  memoize?: boolean;
  fallbackValue?: ReturnValue;
}

export interface UseIt<ReturnValue> {
  (): ReturnValue | undefined;
  Context: Context<ReturnValue | undefined>;
}
