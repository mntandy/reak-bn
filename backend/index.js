
require('dotenv').config()

const express = require('express')
const cors = require('cors')

const axios = require('axios')
const parseString = require("xml2js").parseString

const app = express()


app.use(express.json())
app.use(express.static('build'))

const server = app.listen(3001, () => {
  console.log('listening for requests on port 3001')
})

const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
})

app.use(cors())

const closeEncounters = new Map()
const timers = new Map()


io.on('connection', (socket) => {
  console.log(`${socket.id} just connected!`)

  socket.on('allrecent', (msg) => {
    io.emit('allrecent',[...closeEncounters].map(([key, value]) => ({ key, value })))
  })
  socket.on('disconnect', () => {
    console.log('A user disconnected')
  })
})

const getDroneDistanceFromNest = (drone) => {
  const droneX = Number(drone.positionX)
  const droneY = Number(drone.positionY)
  return Math.sqrt(Math.pow(droneX-250000,2)+Math.pow(droneY-250000,2))
}

const updateCloseEncounter = (serialNumber,addition) => {
  closeEncounters.set(serialNumber,{...closeEncounters.get(serialNumber),...addition})
  io.emit('update recent',[serialNumber,closeEncounters.get(serialNumber)])
}

const getDroneOwner = (serialNumber) => {
  const address = `http://assignments.reaktor.com/birdnest/pilots/${serialNumber}`
  axios
  .get(address).then(response => {
    const data = response.data
    const pilot = {id:data.pilotId,firstName:data.firstName,lastName:data.lastName,phoneNumber:data.phoneNumber,email:data.email}
    updateCloseEncounter(serialNumber,pilot)
  })
  .catch(error => {
    const pilot = {id:-1,firstName:"unknown",lastName:"owner", phoneNumber:"", email: ""}
    updateCloseEncounter(serialNumber,pilot)
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

const deleteEntry = (serialNumber) => () => {
  console.log("deleting",serialNumber)
  closeEncounters.delete(serialNumber)
  timers.delete(serialNumber)
  io.emit('delete recent',serialNumber)
}

const setTimer = (serialNumber) => timers.set(serialNumber,setTimeout(deleteEntry(serialNumber),600000))

const addNewCloseEncounter = (serialNumber,distance) => {
  const pilot = getDroneOwner(serialNumber)
  closeEncounters.set(serialNumber,
    {distance:distance})
  setTimer(serialNumber)
  io.emit('update recent',[serialNumber,closeEncounters.get(serialNumber)])
}

const updateCloseEncounterDistance = (serialNumber,distance) => {
  clearTimeout(timers.get(serialNumber))
  setTimer(serialNumber)
  updateCloseEncounter(serialNumber,{distance})
}

const extractInfo = (drone) => ({serialNumber:String(drone.serialNumber),x:Number(drone.positionX),y:Number(drone.positionY),distance:getDroneDistanceFromNest(drone)})

const processDrones = (drones) => {
  const info = drones.map(drone => extractInfo(drone))
  io.emit('observations',info)

  info.forEach(({serialNumber,distance}) => {
    
    if(distance<100000) {
      if(closeEncounters.has(serialNumber) 
        && closeEncounters.get(serialNumber).distance > distance) {
          updateCloseEncounterDistance(serialNumber,distance)
        }
      else if(!closeEncounters.has(serialNumber))
        addNewCloseEncounter(serialNumber,distance)
    }
  })
}

const processBatch = (result) => {
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

setInterval(getNextBatch,2000)

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
