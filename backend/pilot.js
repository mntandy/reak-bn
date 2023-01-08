  
const unknownPilot = ({firstName:"unknown",lastName:"owner", phoneNumber:"", email: ""})
const extractPilotInfo = (data) => (({firstName,lastName,phoneNumber,email}) => ({firstName,lastName,phoneNumber,email}))(data)

const updatePersonalInfo = (current,pilotData) => {
  const newPilotInfo = (pilotData ? extractPilotInfo(pilotData) : unknownPilot)
  return ({...current,...newPilotInfo})
}

const updateDistance = (current,distance) => ({...current,distance:(current && current.distance? Math.min(current.distance,distance) : distance)})
const unknown = (distance) => ({...unknownPilot,distance})

module.exports = {unknown,updateDistance,updatePersonalInfo}