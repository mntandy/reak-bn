import React, { useEffect,useState,useRef } from 'react';
import './App.css';

import Canvas from './components/Canvas'
import Recent from './components/Recent'
import Message from './components/Message'
import AppContext from './utils/context'
import io from 'socket.io-client'
import useMap from './hooks/usemap'

const socket = io('http://localhost:3001',{
  autoConnect: false
})

const getColor = (value) => value<100000 ? 'red' : 'black' 

const drawCircle = (canvasRef) => {
  const [width,height] = getDimensions(canvasRef)
  const ctx = canvasRef.current.getContext("2d");
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.strokeStyle = 'black'
  ctx.arc(width/2, height/2, width/5, 0, Math.PI * 2, true)
  ctx.stroke()
}

const getDimensions = (canvasRef) => ([Number(canvasRef.current.getAttribute('width')),Number(canvasRef.current.getAttribute('height'))])

const clearCanvas = (canvasRef) => {
  const [width,height] = getDimensions(canvasRef)
  canvasRef.current.getContext('2d').clearRect(0,0,width,height)
}

const drawObservation = (canvasRef,observation) => {
  const ctx = canvasRef.current.getContext("2d");
  const [width,height] = getDimensions(canvasRef)
  const divisor = 500000/width
  ctx.beginPath()
  ctx.fillStyle = getColor(observation.distance)
  ctx.arc(observation.x/divisor, observation.y/divisor, 4, 0, Math.PI * 2, true)
  ctx.fill()
}
const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const canvasRef = useRef()
  const [observations, setObservations] = useState([])
  const [message,setMessage] = useState()
  const recent = useMap()
  
  const context = {
    canvasRef,recent
  }

  useEffect(() => {
    clearCanvas(canvasRef)
    drawCircle(canvasRef)
    observations.forEach(x => drawObservation(canvasRef,x))
  },[observations])

  useEffect(() => {
    isConnected && setMessage("Connected to server.")
    !isConnected && setMessage("Disconnected from server.")
  },[isConnected])
  useEffect(() => {
    socket.connect()
    socket.on('connect', () => {
      setIsConnected(true)
      socket.emit("allrecent")
    })
    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('observations', (ob) => {
      setObservations(ob)
    })
    socket.on('allrecent', (dronesInfo) => {
      dronesInfo.forEach(({key,value}) => {
        recent.set(key,{...value})
      })
    })
    socket.on('update recent', (droneInfo) => {
      recent.update(droneInfo[0],droneInfo[1])
    })
    socket.on('delete recent', (serialNumber) => {
      recent.remove(serialNumber)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('observations')
      socket.off('allrecent')
      socket.off('update recent')
      socket.off('delete recent')
    }
  }, [])


  return (
    <AppContext.Provider value={context}>
      <Message message={message}/>
      <Canvas/>
      <Recent/>
    </AppContext.Provider>
  )
}

export default App;
