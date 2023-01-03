import React from 'react'


const Table = ({recent}) => {
  return <div className="centered padding">
  <table>
    <thead>
    <tr>
    <th>Name</th>
    <th>Phone number</th>
    <th>Email</th>
    <th>Closest observation</th>
    </tr>
  </thead>
  <tbody>
  {Array.from(recent.map.entries()).map(([key, val]) => (
    <tr key={key}>
      <td>{val.firstName + " " + val.lastName}</td>
      <td>{val.phoneNumber}</td>
      <td>{val.email}</td>
      <td>{Math.round(val.distance/100)/10 + " meters"}</td>
    </tr>)
  )}
  </tbody>
</table>
</div>
}
const Recent = ({recent}) => {
  return (
    <div>
      <div className="centered"><b>Recent violations of NFZ</b></div>
      {recent.map.size ? (<Table recent={recent}/>) :
      (<div className="centered padding reducedFont">No info about recent violations</div>)}
    </div>
  )
  
}

export default Recent
