import React,{useContext} from 'react'
import AppContext from '../utils/context'

const Canvas = () => {
  const {canvasRef} = useContext(AppContext)
  const width = Math.min(window.innerWidth-20,500)
  return (
    <div>
      <div className="centered">
        <canvas 
        id={"canvas"} ref={canvasRef} className="canvas" width={width} height={width}>
        Your browser does not support the HTML canvas tag.
        </canvas>
      </div>
    </div>
  )
}

export default Canvas