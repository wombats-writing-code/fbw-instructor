import React, {Component} from 'react'
import {missionConfig} from '@wombats-writing-code/fbw-platform-common/reducers/Mission'


const SelectMissionType = (props) => {

  let isSelectedStyle = "is-selected"

  return (
    <div className="flex-container space-around align-center form-section">
      <p className="mission-type-prompt">Select the type of mission</p>
      <button className={`mission-type-button button ${props.mission.type === missionConfig.PHASE_I_MISSION_TYPE ? isSelectedStyle : null}`}
              onClick={() => props.onChangeMissionType(missionConfig.PHASE_I_MISSION_TYPE)}>
        Phase I Mission
      </button>
    </div>
  )

}

export default SelectMissionType
