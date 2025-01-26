import { useState } from 'react';

import { createStatePairContainer } from '../container/state-pair';

export const createStateContext = <State,>(initialValue: State) => {
  return createStatePairContainer(function () {
    return useState(initialValue);
  });
};
