import React, {Component} from 'react'
const moment = require('moment')
import LoadingBox from '../LoadingBox'
import {PRE_FLIGHT_MISSION} from 'fbw-platform-common/utilities'

import './SideBar.scss'

export default (props) => {

  // === createMissionButton: show only when missions are loaded. not sure why, but it errors out otherwise
  let createMissionButton;
  if (!props.isGetMissionsInProgress && props.missions) {
    createMissionButton = <button className="button create-mission-button"
                                  onClick={() => props.onClickAddMission()}>&#x0002B; Create a mission</button>
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
          {_.map(_.filter(props.missions, {genusTypeId: PRE_FLIGHT_MISSION}), (mission, idx) => {
            let key = `mission_${idx}`;
            let isSelected = (props.currentMission && mission.id === props.currentMission.id);

            // @Cole can you take a look at this?
            let editMissionButton;
            // console.log(moment(mission.deadline).isBefore(moment()));
            if (moment(mission.startTime).isBefore(moment()) ) {
              editMissionButton =  (<button className="button small"
                        onClick={(e) => {props.onClickEditMission(mission); e.stopPropagation()}}>Edit</button>)
            }

           let deleteMissionButton;
            // console.log(moment(mission.deadline).isBefore(moment()));
           deleteMissionButton =  (<button className="button small warning"
                     onClick={(e) => {props.onClickDeleteMission(mission); e.stopPropagation()}}>Delete</button>)
            // console.log(mission, 'startTime', mission.startTime, 'deadline', mission.deadline)
            return (
              <li key={key} className={isSelected ? "clickable-row__item is-selected" : "clickable-row__item"}
                            onClick={() => props.onClickMission(mission, props.currentBank.id)}>
                <p className="row-title">{mission.displayName.text}</p>
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

  // === missionsLoadingBox: if there are no missions, and we aren't loading, display an empty box
  // Also display the loading box while setting up the instructor's private bank (first time)
  let missionsLoadingBox;
  if (!props.isGetMissionsInProgress &&
      !props.isGetPrivateBankIdInProgress) {
    missionsLoadingBox = LoadingBox('enter')

  } else if ((props.isGetMissionsInProgress ||
              props.isGetPrivateBankIdInProgress) &&
            !props.mission) {
    missionsLoadingBox = LoadingBox('enter-active');
  }


  return (
    <div className="side-bar">
    <ul className="clickable-list">
      {_.map(props.banks, (bank, idx) => {
        let key = `bank_${idx}`;
        let isSelected = (props.currentBank && bank.id === props.currentBank.id);

        return (
          <li key={key} className={isSelected ? "clickable-row__item is-selected" : "clickable-row__item"}
                        onClick={() => props.onClickBank(bank, props.username, props.enrolledBanks)}>

            <div >
              <p className="row-title">{bank.displayName.text}</p>
              <p className="row-subtitle">{bank.description.text}</p>
            </div>
          </li>
        )
      })}
    </ul>

    {createMissionButton}

    {missionCollection}
    {missionsLoadingBox}
    </div>
  )

}
