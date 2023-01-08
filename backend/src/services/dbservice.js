const axios = require('axios')

const baseUrl = 'http://assignments.reaktor.com/birdnest'

const getPilotData = (serialNumber,func) => {
    const p = axios.get(`${baseUrl}/pilots/${serialNumber}`)
    return p.then(response => func(response.data))
  .catch(error => {
    console.log(error)
    func(serialNumber,null)
  })
}
  
const getNextDrones = (func) => {
  const p = axios.get(`${baseUrl}/drones`)
  return p.then(response => func(response.data))
  .catch(error => {
    console.log(error)
  })
}

module.exports =  {getPilotData,getNextDrones}
