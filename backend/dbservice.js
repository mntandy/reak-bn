const axios = require('axios')

function dbService(baseUrl) {

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
  return {getPilotData,getNextDrones}
}

module.exports = dbService