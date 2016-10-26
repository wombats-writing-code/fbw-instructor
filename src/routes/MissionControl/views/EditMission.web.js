
import React from 'react'

import BASE_STYLES from '../../../styles/baseStyles'

let styles = {

};

export const EditMissionWeb = (props) => {

  // @Cole: need help
  // use https://github.com/airbnb/react-dates for date picking

  return (
    <div>
      <input type="text" value="" />


    <button className="button" onClick={() => props.onUpdateMission()}>Save changes</button>

    </div>
  )


}
