import React from 'react';

import { CounterAction } from './components/CounterAction';
import { CounterDisplay } from './components/CounterDisplay';
import { CounterProvider } from './Containers/RootSharedContainer';

function App() {
  return (
    <div className="App">
      <h1>Simple Counter</h1>
      <CounterProvider>
        <CounterDisplay />
        <CounterAction />
      </CounterProvider>
    </div>
  );
}

export default App;
