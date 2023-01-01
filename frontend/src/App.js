import React from 'react';
import './App.css';

import Canvas from './components/Canvas'
import Recent from './components/Recent'
import AppContext from './utils/context'

const App = () => {
  const canvasRef = useRef()
  const context = {
    canvasRef,
  }
  return (
    <AppContext.Provider value={context}>
      <div className="centered"><h2>Recent violations of NFZ</h2></div>
      <Canvas/>
      <Recent/>
    </AppContext.Provider>
  )
}

export default App;
