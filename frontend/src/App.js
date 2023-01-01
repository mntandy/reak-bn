import React, { useEffect,useState,useRef } from 'react';
import './App.css';

import Canvas from './components/Canvas'
import Recent from './components/Recent'
import AppContext from './utils/context'
import io from 'socket.io-client'

const socket = io('http://localhost:3001')

const getColor = (value) => value<100000 ? 'red' : 'black' 

const drawCircle = (canvasRef) => {
  const ctx = canvasRef.current.getContext("2d");
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.strokeStyle = 'black'
  ctx.arc(250, 250, 100, 0, Math.PI * 2, true)
  ctx.stroke()
}

const getDimensions = (canvasRef) => ([Number(canvasRef.current.getAttribute('width')),Number(canvasRef.current.getAttribute('height'))])

const clearCanvas = (canvasRef) => {
  const [width,height] = getDimensions(canvasRef)
  canvasRef.current.getContext('2d').clearRect(0,0,width,height)
}

const drawObservation = (canvasRef,observation) => {
  const ctx = canvasRef.current.getContext("2d");
  ctx.beginPath()
  ctx.fillStyle = getColor(observation.distance)
  ctx.arc(observation.x/1000, observation.y/1000, 4, 0, Math.PI * 2, true)
  ctx.fill()
}
const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const canvasRef = useRef()
  const [observations, setObservations] = useState([])
  const context = {
    canvasRef,
  }

  useEffect(() => {
    clearCanvas(canvasRef)
    drawCircle(canvasRef)
    observations.forEach(x => drawObservation(canvasRef,x))
  },[observations])

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    })
    socket.on('disconnect', () => {
      setIsConnected(false);
    })
    socket.on('observations', (ob) => {
      console.log('observations',ob)
      setObservations(ob)
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
