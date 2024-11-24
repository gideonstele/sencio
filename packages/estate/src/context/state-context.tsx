import { createStatePairContainer } from '../container/state-pair';
import { useState } from 'react';

export const createStateContext = <State,>(initialValue: State) => {
  return createStatePairContainer(function () {
    return useState(initialValue);
  });
};
