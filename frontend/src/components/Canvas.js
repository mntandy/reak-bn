import React,{useEffect} from 'react'

const getColor = (value) => value<100000 ? 'red' : 'black' 

const getDimensions = (canvasRef) => ({width:Number(canvasRef.current.getAttribute('width')),height:Number(canvasRef.current.getAttribute('height'))})

const drawCircle = (canvasRef) => {
  const {width,height} = getDimensions(canvasRef)
  const ctx = canvasRef.current.getContext("2d");
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.strokeStyle = 'black'
  ctx.arc(width/2, height/2, width/5, 0, Math.PI * 2, true)
  ctx.stroke()
}

const clearCanvas = (canvasRef) => {
  const {width,height} = getDimensions(canvasRef)
  canvasRef.current.getContext('2d').clearRect(0,0,width,height)
}

const drawObservation = (canvasRef,observation) => {
  const ctx = canvasRef.current.getContext("2d");
  const {width} = getDimensions(canvasRef)
  const divisor = 500000/width
  ctx.beginPath()
  ctx.fillStyle = getColor(observation.distance)
  ctx.arc(observation.x/divisor, observation.y/divisor, 4, 0, Math.PI * 2, true)
  ctx.fill()
}

const Canvas = ({canvasRef,observations}) => {
  const width = Math.min(window.innerWidth-20,250)
  
  useEffect(() => {
    clearCanvas(canvasRef)
    drawCircle(canvasRef)
    observations.forEach(x => drawObservation(canvasRef,x))
  },[observations])

  return (
    <div>
      <div className="centered"><b>Live observations</b></div>
      <div className="centered padding">
        <canvas 
        id={"canvas"} ref={canvasRef} className="canvas" width={width} height={width}>
        Your browser does not support the HTML canvas tag.
        </canvas>
      </div>
    </div>
  )
}

export default Canvas