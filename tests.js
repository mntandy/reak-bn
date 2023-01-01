
const test_getDrones = () => {
  console.log(getDrones(1)===undefined)
  console.log(getDrones({test:1})===undefined)
  console.log(getDrones({report:{test:1}})===undefined)
  console.log(getDrones({report:{capture:1}})===undefined)
  console.log(getDrones({report:{capture:[]}})===undefined)
  console.log(getDrones({report:{capture:[{test:1}]}})===undefined)
  console.log(getDrones({report:{capture:[{drone:[]}]}}).length===0)
}