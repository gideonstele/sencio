import React from 'react';

import { useCounterContainer } from '../Containers/RootSharedContainer';

export const CounterDisplay = () => {
  const { count } = useCounterContainer();

  return <p>Count: {count}</p>;
};
