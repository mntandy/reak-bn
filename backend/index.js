
require('dotenv').config()
const express = require('express')
//const cors = require('cors')
const axios = require('axios')
const parseString = require("xml2js").parseString

const getDroneDistanceFromNest = (drone) => {
  const droneX = Number(drone.positionX)
  const droneY = Number(drone.positionY)
  const x = Math.pow(droneX-250000,2)
  const y = Math.pow(droneY-250000,2)
  return Math.sqrt(x+y)
}

const extractInfo = (drone) => ({serial:drone.serialNumber,x:positionX,y:positionY})
const closeEncounters = new Map() //key:serial object: pilot+closestDistance+timerId
const getDroneOwner = (drone) => {
  axios
  .get(`http://assignments.reaktor.com/birdnest/pilots/${drone.serialNumber}`).then(response => {
    const data = response.data
    const pilot = {id:data.pilotId,firstname:data.firstName,lastname:data.lastName,phoneNumber:data.phoneNumber,email:data.email}

  })
  .catch(error => {console.dir(error)})
}

const getDrones = (result) => result.report.capture[0].drone

const getDronesSerialAndDistance = (drones) => drones.map(drone => [drone.serialNumber,getDroneDistanceFromNest(drone)])

const processBatch = (result) => {
  const drones = getDrones(result)
  const serialAndInfo = getDronesSerialAndDistance(drones)
  serialAndInfo.forEach(([serialNumber,distance]) => {
    if(distance<100000) {
      if(closeEncounters.has(serialNumber)) {
        if(closeEncounters.get(serialNumber).closestDistance < distance)
          closeEncounters.get(serialNumber).closestDistance = distance
      else {
        //new closeEncounter
      }
      }
    }
  })

}
const getNextBatch = () => {
  axios.get("http://assignments.reaktor.com/birdnest/drones").then(response => {
    const data = response.data
    console.log(data)
    parseString(data, (err,result) => console.dir(getDronesDistance(getDrones(result))))
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

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})