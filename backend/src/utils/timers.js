function Timers(func,clearoutTime) {
  const timers = {}
  const clear = (key) => clearTimeout(timers[key])

  const set = (key) => {
    if(timers[key])
      clear(key)
    timers[key] = setTimeout(func(key),clearoutTime)
  }

  const remove = (key) => delete timers[key]
  
  return {set,remove,clear}
}

module.exports = Timers