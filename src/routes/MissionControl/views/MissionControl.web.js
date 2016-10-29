
import React from 'react'

import {AddMissionWeb} from './AddMission.web'
import {EditMissionWeb} from './EditMission.web'

import BASE_STYLES from '../../../styles/baseStyles'

let styles = {

};

export const MissionControlWeb = (props) => {

  let view;
  if (props.view.name === 'edit-mission') {
    view = EditMissionWeb(props)

  } else if (props.view.name === 'add-mission') {
    view = AddMissionWeb(props)
  }

  return (
    <div>
      <h1>Mission Control: Add and edit missions here</h1>
      <p>{props.mission ? props.mission.displayName.text : null}</p>
      {view}
    </div>
  )
}
