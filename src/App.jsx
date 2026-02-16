import React from 'react';
import { GeminiProvider } from './context/GeminiProvider';
import Scene from './components/Scene';
import HUD from './components/HUD';

function App() {
  return (
    <GeminiProvider>
      <div className="w-screen h-screen bg-black relative">
        <Scene />
        <HUD />
      </div>
    </GeminiProvider>
  );
}

export default App;
