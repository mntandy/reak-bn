  
const unknownPilot = ({firstName:"unknown",lastName:"owner", phoneNumber:"", email: ""})
const extractInfo = (data) => (({firstName,lastName,phoneNumber,email}) => ({firstName,lastName,phoneNumber,email}))(data)

const getInfo = (pilotData) => (pilotData ? extractInfo(pilotData) : unknownPilot)


const updateDistance = (oldDistance,newDistance) => ({distance:Math.min(oldDistance,newDistance)})
const unknown = (distance) => ({...unknownPilot,distance})

module.exports = {unknown,updateDistance,getInfo}