
const getDistanceFromNest = (drone) => {
  const droneX = Number(drone.positionX)
  const droneY = Number(drone.positionY)
  return Math.sqrt(Math.pow(droneX-250000,2)+Math.pow(droneY-250000,2))
}

const extractInfo = (drone) => {  
  return ({serialNumber:String(drone.serialNumber),
    x:Number(drone.positionX),
    y:Number(drone.positionY),
    distance:getDroneDistanceFromNest(drone)})
}

module.exports = {extractInfo}