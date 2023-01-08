import { useEffect,useRef} from 'react';
import io from 'socket.io-client'

const useSocket = (recent,setObservations,setMessage) => {
  const {current} = useRef(io('',{
    autoConnect: false
  }))

  useEffect(() => {
    current.connect()
    current.on('connect', () => {
      setMessage("Connected to server")
      current.emit("allrecent")
    })
    current.on('disconnect', () => {
      setMessage("Disconnected from server")
    })
    current.on("connect_error", () => {
      current.disconnect()
      setTimeout(() => {
        current.connect()
      }, 10000)
    })
    current.on('observations', (ob) => {
      setObservations(ob)
    })
    current.on('allrecent', (dronesInfo) => {
      recent.reset()
      dronesInfo.forEach(({key,value}) => {
        recent.set(key,{...value})
      })
    })
    current.on('update recent', (droneInfo) => {
      recent.update(droneInfo[0],droneInfo[1])
    })
    current.on('delete recent', (serialNumber) => {
      recent.remove(serialNumber)
    })

    return () => {
      current.off('connect')
      current.off('disconnect')
      current.off('connect_error')
      current.off('observations')
      current.off('allrecent')
      current.off('update recent')
      current.off('delete recent')
    }
  }, [current])
}

export default useSocket