import { useState } from 'react';
import { createDualContainer } from '../advanced';

export const createStateContext = <State,>(initialValue: State) => {
  return createDualContainer(function useCreateDual() {
    return useState(initialValue);
  });
};
