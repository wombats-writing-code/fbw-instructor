
import DuckImage from '../assets/Duck.jpg'
import React from 'react'

export const HomeViewWeb = (props) => {
  return (
    <div>
      <h4>Welcome!</h4>
      <img
        alt='This is a duck, because Redux!'
        className='duck'
        src={DuckImage} />

      <ul>
        {_.map(props.missions, (mission) => {
          return (
            <li onClick={props.onClickMission(mission)}>
              Hi
            </li>
          )
        })}
      </ul>

    </div>
  )
}
