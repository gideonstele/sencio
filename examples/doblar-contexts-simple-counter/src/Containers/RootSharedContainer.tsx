import { useState } from 'react';
import { createContainer } from '@sencio/doblar-contexts';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const [CounterProvider, useCounterContainer] =
  createContainer<CounterState>(function useCounterContainer() {
    const [count, setCount] = useState(0);
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    return { count, increment, decrement };
  });
