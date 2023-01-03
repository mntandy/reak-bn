import React, { useState,useRef } from 'react';
import './App.css';

import Canvas from './components/Canvas'
import Recent from './components/Recent'
import Message from './components/Message'
import useSocket from './hooks/useSocket'
import useMap from './hooks/useMap'

const App = () => {
  const canvasRef = useRef()
  const [observations, setObservations] = useState([])
  const [message,setMessage] = useState("Disconnected from server")
  const recent = useMap()

  useSocket(recent,setObservations,setMessage)
  
  return (
    <div>
      <Message message={message}/>
      <Canvas observations={observations} canvasRef={canvasRef}/>
      <Recent recent={recent}/>
    </div>
  )
}

export default App;
