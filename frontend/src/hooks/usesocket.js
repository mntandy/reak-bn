import { useEffect,useState} from 'react';
import io from 'socket.io-client'

const useSocket = (recent,setObservations,setIsConnected) => {
  const [socket,setSocket] = useState(io('http://localhost:3001',{
    autoConnect: false
  }))

  useEffect(() => {
    socket.connect()
    socket.on('connect', () => {
      setIsConnected(true)
      socket.emit("allrecent")
    })
    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('observations', (ob) => {
      setObservations(ob)
    })
    socket.on('allrecent', (dronesInfo) => {
      dronesInfo.forEach(({key,value}) => {
        recent.set(key,{...value})
      })
    })
    socket.on('update recent', (droneInfo) => {
      recent.update(droneInfo[0],droneInfo[1])
    })
    socket.on('delete recent', (serialNumber) => {
      recent.remove(serialNumber)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('observations')
      socket.off('allrecent')
      socket.off('update recent')
      socket.off('delete recent')
    }
  }, [socket])
}

export default useSocket