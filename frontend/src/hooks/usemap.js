import { useCallback,useEffect,useState } from 'react';

const useMap = (initialState = new Map()) => {

  const [map, setMap] = useState(new Map(initialState))
  
  const set = useCallback((key, value) => 
      setMap(prev => new Map(prev).set(key, value))
    ,[])
  
  const update = useCallback((key, value) => 
    setMap(prev => new Map(prev).set(key, {...prev.get(key),...value}))
  ,[])

  const remove = useCallback(key => setMap(prev => {
      const copy = new Map(prev)
      copy.delete(key)
      return copy
      })
    ,[])

  const reset = useCallback(() => {
      setMap(new Map())
    },[])

  useEffect(() => {
    console.log(Array.from(map.keys()).length)
    }
  ,[map])
  return {map,set,remove,reset,update}
}


export default useMap