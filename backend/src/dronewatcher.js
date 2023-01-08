const io = require('./services/socketServer')(require('./services/httpServer'))
const dbService = require('./services/dbservice')
const pilot = require('./utils/pilot')
const drone = require('./utils/drone')

const distributeViolator = (serialNumber) =>  
  io.update(serialNumber,recentViolations[serialNumber])

const updateViolator = (serialNumber,update) => 
  recentViolations[serialNumber] = {...recentViolations[serialNumber],...update}

const processDrones = (drones) => {
  const info = drones.map(next => drone.extractInfo(next))
  io.shareObservations(info)

  info.forEach(({serialNumber,distance}) => {
    if(distance<100000) {
      if(!recentViolations[serialNumber]) {
        updateViolator(serialNumber,pilot.unknown(distance))
        dbService.getPilotData(serialNumber,(pilotData) => {
          updateViolator(serialNumber,pilot.getInfo(pilotData))
          distributeViolator(serialNumber)
        })
      }
      else
        updateViolator(serialNumber,pilot.updateDistance(recentViolations[serialNumber].distance,distance))
      distributeViolator(serialNumber)
      timers.set(serialNumber)
    }
    else if(recentViolations[serialNumber])
      timers.set(serialNumber)
  })
}

const removeViolator = (serialNumber) => () => {
  delete recentViolations[serialNumber]
  timers.remove(serialNumber)
  io.remove(serialNumber)
}

const processBatch = (result) => {
  const drones = Array.isArray(result.report?.capture) && result.report.capture.at(0).drone
  if(!drones) console.log("bad data")
  else if(drones===[]) console.log("no drones")
  else processDrones(drones)
}

const getAllRecent = () => recentViolations

const parseToBatch = (data) => require("xml2js").parseString(data, (err,result) => processBatch(result))

const recentViolations = {}
const timers = require('./utils/timers')(removeViolator,600000)

const start = () => {
  io.addClientEvent(['allrecent','allrecent',getAllRecent])

  setInterval(() => dbService.getNextDrones(parseToBatch),2000)
}

module.exports = {start}