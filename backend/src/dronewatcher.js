const io = require('./services/socketServer')(require('./services/httpServer'))
const dbService = require('./services/dbservice')
const pilot = require('./utils/pilot')
const drone = require('./utils/drone')

const distributeViolator = (serialNumber) =>  
  io.update(serialNumber,recentViolations.get(serialNumber))

const updateViolator = (serialNumber,update) => 
  recentViolations.set(serialNumber,{...recentViolations.get(serialNumber),...update})

const processDrones = (drones) => {
  const info = drones.map(next => drone.extractInfo(next))
  io.shareObservations(info)

  info.forEach(({serialNumber,distance}) => {
    const recentViolator = recentViolations.get(serialNumber)
    if(distance<100000) {
      if(!recentViolator) {
        updateViolator(serialNumber,pilot.unknown(distance))
        dbService.getPilotData(serialNumber,(pilotData) => {
          updateViolator(serialNumber,pilot.getInfo(pilotData))
          distributeViolator(serialNumber)
        })
      }
      else
        updateViolator(serialNumber,pilot.updateDistance(recentViolator.distance,distance))
      distributeViolator(serialNumber)
      timers.set(serialNumber)
    }
    else if(recentViolator)
      timers.set(serialNumber)
  })
}

const removeViolator = (serialNumber) => () => {
  recentViolations.delete(serialNumber)
  timers.remove(serialNumber)
  io.remove(serialNumber)
}

const processBatch = (result) => {
  const drones = Array.isArray(result.report?.capture) && result.report.capture.at(0).drone
  if(!drones) console.log("bad data")
  else if(drones===[]) console.log("no drones")
  else processDrones(drones)
}

const getAllRecent = () => [...recentViolations].map(([key, value]) => ({ key, value }))
  
const parseToBatch = (data) => require("xml2js").parseString(data, (err,result) => processBatch(result))

const recentViolations = new Map()
const timers = require('./utils/timers')(removeViolator,600000)

const start = () => {
  io.addClientEvent(['allrecent','allrecent',getAllRecent])

  setInterval(() => dbService.getNextDrones(parseToBatch),2000)
}

module.exports = {start}