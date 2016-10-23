import React from 'react'

export const Mission = (props) => (
  <div style={{ margin: '0 auto' }} >
    <h2>Mission: {props.mission}</h2>
    <button className='btn btn-default' onClick={props.increment}>
      Increment
    </button>
    {' '}
    <button className='btn btn-default' onClick={props.doubleAsync}>
      Double (Async)
    </button>
  </div>
)

Mission.propTypes = {
  mission     : React.PropTypes.number.isRequired,
  doubleAsync : React.PropTypes.func.isRequired,
  increment   : React.PropTypes.func.isRequired
}

export default Mission
