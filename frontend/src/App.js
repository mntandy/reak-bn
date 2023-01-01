import React, { useEffect,useState,useRef } from 'react';
import './App.css';

import Canvas from './components/Canvas'
import Recent from './components/Recent'
import AppContext from './utils/context'
import io from 'socket.io-client'

const socket = io('http://localhost:3001')

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const canvasRef = useRef()
  const context = {
    canvasRef,
  }
  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    })
    socket.on('disconnect', () => {
      setIsConnected(false);
    })
    socket.on('observations', (ob) => {
      console.log('observations',ob)
    })
    socket.on('allrecent', (recent) => {
      console.log('allrecent',recent)
    })
    socket.on('update recent', (recent) => {
      console.log('update recent',recent)
    })
    socket.on('delete recent', (serialNumber) => {
      console.log('delete recent',serialNumber)
    })
    socket.emit("allrecent")
    return () => {
      socket.off('connect')
      socket.off('disconnect')
    };
  }, [])
  return (
    <AppContext.Provider value={context}>
      <div className="centered"><h2>Recent violations of NFZ</h2></div>
      <Canvas/>
      <Recent/>
    </AppContext.Provider>
  )
}

export default App;
