import React from 'react';

import { useCounterContainer } from '../Containers/RootSharedContainer';

export function CounterAction() {
  const { increment, decrement } = useCounterContainer();
  return (
    <div className="Counter">
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}
