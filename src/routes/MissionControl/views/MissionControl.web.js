
import React from 'react'

import {AddMissionWeb} from './AddMission.web'
import {EditMissionWeb} from './EditMission.web'

import BASE_STYLES from '../../../styles/baseStyles'

let styles = {
  missionControlTitle:{
    fontSize: '1.25rem',
    fontWeight: "700",
    color: '#888',
    textAlign: "left",
    marginTop: 0,
    marginBottom: '1.75rem'
  }
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
      <h1 style={styles.missionControlTitle}>Mission Control</h1>
      <p>{props.mission ? props.mission.displayName.text : null}</p>
      {view}
    </div>
  )
}
