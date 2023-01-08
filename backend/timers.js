function Timers(func,clearoutTime) {
  const timers = new Map()
  const clear = (key) => clearTimeout(timers.get(key))

  const set = (key) => {
    if(timers.has(key))
      clear(key)
    timers.set(key,setTimeout(func(key),clearoutTime))
  }

  const remove = (key) => timers.delete(key)
  
  return {set,remove,clear}
}

module.exports = Timers