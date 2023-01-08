const io = require('./socketServer')(require('./httpServer'))
const dbService = require('./dbservice')('http://assignments.reaktor.com/birdnest')
const pilot = require('./pilot')
const drone = require('./drone')

const distributeViolator = (serialNumber) =>  
  io.update(serialNumber,recentViolations.get(serialNumber))

const processDrones = (drones) => {
  const info = drones.map(next => drone.extractInfo(next))
  io.shareObservations(info)

  info.forEach(({serialNumber,distance}) => {
    if(distance<100000) {
      const recentViolator = recentViolations.get(serialNumber)
      if(!recentViolator) {
        dbService.getPilotData(serialNumber,(pilotData) => {
          recentViolations.set(serialNumber,pilot.updatePersonalInfo({distance},pilotData))
          distributeViolator(serialNumber)
        })
      }
      else
        recentViolations.set(serialNumber,pilot.updateDistance(recentViolator,distance))
      distributeViolator(serialNumber)
      timers.set(serialNumber)
    }
    else if(recentViolations.has(serialNumber))
      timers.set(serialNumber)
  

  })
}

const removeViolator = (serialNumber) => () => {
  recentViolations.delete(serialNumber)
  timers.remove(serialNumber)
  io.remove(serialNumber)
}

const processBatch = (result) => {
  const drones = Array.isArray(result.report?.capture) && result.report?.capture.at(0).drone
  if(!drones)
    console.log("bad data")
  else if(drones===[])
    console.log("no drones")
  else
    processDrones(drones)
}

const getAllRecent = () => [...recentViolations].map(([key, value]) => ({ key, value }))
  
const parseToBatch = (data) => require("xml2js").parseString(data, (err,result) => processBatch(result))

const recentViolations = new Map()
const timers = require('./timers')(removeViolator,600000)

const start = () => {

  io.addClientEvent(['allrecent','allrecent',getAllRecent])

  setInterval(() => dbService.getNextDrones(parseToBatch),2000)
}

module.exports = {start}