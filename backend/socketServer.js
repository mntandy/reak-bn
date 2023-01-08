

function SocketServer(httpServer) {
  const io = require("socket.io")(httpServer, {cors: {origin: '*'}})
  const events = []
  const addClientEvent = (event) => events.push(event)
  
  const remove = (serialNumber) => io.emit('delete recent',serialNumber)
  const update = (serialNumber,msg) => io.emit('update recent',[serialNumber,msg])
  const shareObservations = (msg) => io.emit('observations',msg)
  io.on('connection', (socket) => {
    console.log(`${socket.id} just connected!`)

    events.forEach(([inkey,outkey,action]) => {
      socket.on(inkey, (msg) => {
        io.emit(outkey,action(msg))
      }) 
    })
  
    socket.on('disconnect', () => {
      console.log('A user disconnected')
    })
  })
  return {addClientEvent,remove,update,shareObservations}
}

module.exports = SocketServer