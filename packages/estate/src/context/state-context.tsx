import { createStateContainer } from '../advanced';
import { useState } from 'react';

export const createStateContext = <State,>(initialValue: State) => {
  return createStateContainer(function useCreateDual() {
    return useState(initialValue);
  });
};
