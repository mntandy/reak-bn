
require('dotenv').config()
const express = require('express')
//const cors = require('cors')
const axios = require('axios')
const parseString = require("xml2js").parseString

const getDroneDistanceFromNest = (drone) => {
  const droneX = Number(drone.positionX)
  const droneY = Number(drone.positionY)
  return Math.sqrt(Math.pow(droneX-250000,2)+Math.pow(droneY-250000,2))
}

const extractInfo = (drone) => ({serial:drone.serialNumber,x:positionX,y:positionY})

const closeEncounters = new Map()
const timers = new Map()

const getDroneOwner = (serialNumber) => {
  const address = `http://assignments.reaktor.com/birdnest/pilots/${serialNumber}`
  console.log(address)
  axios
  .get(address).then(response => {
    const data = response.data
    const pilot = {id:data.pilotId,firstName:data.firstName,lastName:data.lastName,phoneNumber:data.phoneNumber,email:data.email}
    closeEncounters.set(serialNumber,{...closeEncounters.get(serialNumber),...pilot})
  })
  .catch(error => {
    const pilot = {id:-1,firstName:"unknown",lastName:"owner", phoneNumber:"", email: ""}
    closeEncounters.set(serialNumber,{...closeEncounters.get(serialNumber),...pilot})
  })
}

const getDrones = (result) => {
  const capture = result.report?.capture
  if(capture!==undefined && 
    Array.isArray(capture) && 
    capture.length>0) {
      return capture[0].drone
    }
  return undefined
}

const getDronesSerialAndDistance = (drones) => drones.map(drone => [...drone.serialNumber,getDroneDistanceFromNest(drone)])

const deleteEntry = (serialNumber) => () => {
  console.log("deleting",serialNumber)
  closeEncounters.delete(serialNumber)
  timers.delete(serialNumber)
}

const setTimer = (serialNumber) => timers.set(serialNumber,setTimeout(deleteEntry(serialNumber),600000))

const addNewCloseEncounter = (serialNumber,distance) => {
  const pilot = getDroneOwner(serialNumber)
  closeEncounters.set(serialNumber,
    {distance:distance})
  setTimer(serialNumber)
}

const updateCloseEncounter = (serialNumber,distance) => {
  console.log("updating",serialNumber)
  closeEncounters.get(serialNumber).distance = distance
  clearTimeout(timers.get(serialNumber))
  setTimer(serialNumber)
}

const processDrones = (drones) => {
  const serialAndInfo = getDronesSerialAndDistance(drones)
  console.log(serialAndInfo)
  serialAndInfo.forEach(([serialNumber,distance]) => {
    if(distance<100000) {
      console.log(serialNumber,distance)
      if(closeEncounters.has(serialNumber) 
        && closeEncounters.get(serialNumber).distance < distance)
          updateCloseEncounter(serialNumber,distance)
      else
        addNewCloseEncounter(serialNumber,distance)
    }
  })
}

const processBatch = (result) => {
  console.log(closeEncounters)
  console.log(Array.from(timers.keys()))
  const drones = getDrones(result)
  if(drones===undefined || drones===[])
    console.log("bad data")
  if(drones===[])
    console.log("no drones")
  else
    processDrones(drones)
}


const getNextBatch = () => {
  axios.get("http://assignments.reaktor.com/birdnest/drones").then(response => {
    const data = response.data
    parseString(data, (err,result) => processBatch(result))
  })
}

const app = express()
//app.use(cors())
app.use(express.json())
app.use(express.static('build'))

setInterval(getNextBatch,2000)

app.get('/api/closeencounters', (request, response) => {
	response.json(docs)
	},(err) => next(err))

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)
  
const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	if (error.name === 'CastError')
		return response.status(400).send({ error: 'malformatted id' })
	else if (error.name === 'ValidationError')    
		return response.status(400).json({ error: error.message })
	next(error)
}

app.use(errorHandler)

//const PORT = process.env.PORT
//app.listen(PORT, () => {
//	console.log(`Server running on port ${PORT}`)
//})