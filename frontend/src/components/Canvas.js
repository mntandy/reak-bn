import React,{useContext} from 'react'
import AppContext from '../utils/context'

const Canvas = () => {
  const {canvasRef} = useContext(AppContext)
  
  return (
    <div>
      <div>
        <canvas 
        id={"canvas"} ref={canvasRef} className="canvas" width={Math.min(window.innerWidth-20,400)} height="200">
        Your browser does not support the HTML canvas tag.
        </canvas>
      </div>
    </div>
  )
}

export default Canvas