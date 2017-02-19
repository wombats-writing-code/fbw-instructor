
import React, {Component} from 'react'
import _ from 'lodash';

// import './Missions.scss'

class Missions extends Component {


  render() {
    // === missionsLoadingBox: if there are no missions, and we aren't loading, display an empty box
    // Also display the loading box while setting up the instructor's private course (first time)
    let missionsLoadingBox;
    if ((props.isGetMissionsInProgress)) {
      missionsLoadingBox = LoadingBox('enter-active');

    } else if (!props.isGetMissionsInProgress) {
      missionsLoadingBox = LoadingBox('enter')

    }

    // === missionCollection: show only when missions are loaded and exist
    let missionCollection;
    if (!props.isGetMissionsInProgress && props.missions) {
      if (props.missions.length === 0) {
        missionCollection = (
          <ul key="missionCollection" className="">
            <li key={0} className="">
              <div className="">
                <p className="">No missions yet</p>
              </div>
            </li>
          </ul>
        )
      } else {
        missionCollection = (
          <ul key="missionCollection" className="clickable-list">
            {_.map(props.missions, (mission, idx) => {
              let key = `mission_${idx}`;
              let isSelected = (props.currentMission && mission.id === props.currentMission.id);

              let editMissionButton =  (<button className="button small"
                  onClick={(e) => {props.onClickEditMission(mission, props.outcomes); e.stopPropagation()}}>Edit</button>)

             let deleteMissionButton =  (<button className="button small warning"
                       onClick={(e) => {props.onClickDeleteMission(mission, props.currentCourse.id); e.stopPropagation()}}>Delete</button>)
              // console.log(mission, 'startTime', mission.startTime, 'deadline', mission.deadline)


              return (
                <li key={key} className={isSelected ? "clickable-row__item is-selected" : "clickable-row__item"}
                              onClick={() => props.onClickMission(mission)}>
                  <p className="row-title">{mission.displayName}</p>
                  <p className="row-subtitle">
                    <span className="">From </span>
                    <span className="">{moment(mission.startTime).format('dddd MMM D')} </span>
                    <span className="">to </span>
                    <b className="">{moment(mission.deadline).format('dddd MMM D')}</b>
                  </p>

                  <div className="flex-container space-between mission-buttons">
                    {deleteMissionButton}
                    {editMissionButton}
                  </div>
                </li>
              )
            })}
          </ul>
        )
      }
    }

  }
}

export default Missions
