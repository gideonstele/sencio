import { Context } from 'react';

export type HookFnContainer<Params extends object, ReturnValue> = (
  params: Params,
) => ReturnValue;

export interface CreateContainerOptions<ReturnValue> {
  providerWrapperRequired?: boolean;
  fallbackValue?: ReturnValue;
  isEqual?: (a: unknown, b: unknown) => boolean;
}

export interface UseIt<ReturnValue> {
  (): ReturnValue | undefined;
  Context: Context<ReturnValue | undefined>;
}
