'use strict'
import moment from 'moment'
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import slug from 'slug'

import LoadingBox from 'fbw-platform-common/components/loading-box/web/'
import EmptyState from 'fbw-platform-common/components/empty-state/web/'
import Timeline from './Timeline'
import './Missions.scss'

import {checkMissionStatus} from 'fbw-platform-common/utilities/time'
import {missionConfig} from 'fbw-platform-common/reducers/Mission'

class Missions extends Component {

  constructor() {
    super();

    this.state = {
      confirmDeleteFocus: null,
      confirmDeleteValue: '',
      isConfirmDeleteVisible: false
    }
  }

  componentDidMount () {
    this.props.getMissions({
      course: this.props.course,
      user: this.props.user,
      all: true
    })

    // get mapping happens when Missions load
    this.props.getMapping({
      course: this.props.course,
      user: this.props.user,
      entityTypes: ['outcome', 'module'],
      relationshipTypes: ['HAS_PARENT_OF', 'HAS_PREREQUISITE_OF'],
    });
  }


  render() {
    let props = this.props;

    let createMissionButton;
    if (!props.isGetMappingInProgress && props.missions) {
      createMissionButton = (
          <button className="button create-mission-button"
                  onClick={() => props.onClickAddMission()}>&#x0002B; Create a mission</button>
      )
    }

    // === missionCollection: show only when missions are loaded and exist
    if (!props.isGetMissionsInProgress && props.missions && props.missions.length === 0) {
      // console.log('props.missions', props.missions)
      return (
        <div>
          {createMissionButton}
          {EmptyState("No missions yet")}
        </div>
      )
    }

    // === missionsLoadingBox: if there are no missions, and we aren't loading, display an empty box
    let missionsLoadingBox;
    if (props.isGetMissionsInProgress) {
      missionsLoadingBox = LoadingBox('enter-active');

    } else if (!props.isGetMissionsInProgress) {
      missionsLoadingBox = LoadingBox('enter')

    }

    return (
      <div>
        <ul key="missionCollection" className="medium-12 large-7 medium-centered columns no-style">
          {createMissionButton}

          {_.map(this._getVisibleMissions(), (mission, idx) => {
            let key = `mission_${idx}`;

            let editMissionButton =  (<button className="button mission-card__button small"
                onClick={(e) => {props.onClickEditMission(mission); e.stopPropagation()}}>
                  Edit</button>)

             let deleteMissionButton =  (<button className="button mission-card__button small warning"
                     onClick={(e) => {this._onClickDelete(mission); e.stopPropagation()}}>
                      Delete</button>)

            // console.log(mission, 'startTime', mission.startTime, 'deadline', mission.deadline)
            let confirmDelete = (
              <div>
                <input className="confirm-delete-input" placeholder="Type the mission name here"
                      value={this.state.confirmDeleteValue}
                      onChange={(e) => {this.setState({confirmDeleteValue: e.target.value}); e.stopPropagation()}} />

                <div className="flex-container">
                  <button className="button mission-card__button small warning"
                          onClick={(e) => {e.stopPropagation(); this._onConfirmDeleteMission(mission)}}>
                           Confirm delete</button>

                   <button className="button mission-card__button small"
                           onClick={() => this.setState({isConfirmDeleteVisible: false})}>
                            Cancel</button>
                </div>
              </div>
            )

            // generate timeline points
            let timelinePoints = [
              {time: mission.startTime, text: 'Starts'},
              {time: mission.deadline, text: 'Due'},
            ];
            if (mission.leadsToMissions && mission.leadsToMissions.length > 0) {
              let phase2 = _.find(props.missions, {id: mission.leadsToMissions[0]});
              timelinePoints = _.concat(timelinePoints, [
                {time: phase2.startTime, text: 'Phase 2 starts'},
                {time: phase2.deadline, text: 'Phase 2 due'},
              ]);
            }


            return (
              <li key={key} className="mission-card "
                            onClick={() => props.onClickMission(mission, this.props.user)}>
                <p className="mission-card__title">{mission.displayName}</p>
                <div className="mission-card__body">
                  <p className="mission-card__date">
                    <span className="">From </span>
                    <span className="">{moment(mission.startTime).format('ddd MMM D [at] ha')} </span>
                    <span className="">to </span>
                    <b className="">{moment(mission.deadline).format('ddd MMM D [at] ha')}</b>
                  </p>

                  <div className="mission-card__timeline">
                    <Timeline points={timelinePoints}/>
                  </div>

                  <div className="flex-container mission-buttons">
                    {this.state.isConfirmDeleteVisible ? null : deleteMissionButton}
                    {this.state.isConfirmDeleteVisible ? null : editMissionButton}
                  </div>

                  {this.state.confirmDeleteFocus === mission ? confirmDelete : null}
                </div>

              </li>
            )
          })}
        </ul>

        {missionsLoadingBox}
      </div>
    )
  }

  _onClickDelete(mission) {
    this.setState({
      confirmDeleteFocus: mission,
      isConfirmDeleteVisible: true
    });
  }

  _onConfirmDeleteMission(mission) {
    // console.log('confirmDeleteValue', this.state.confirmDeleteValue, 'mission name', mission.displayName)

    if (this.state.confirmDeleteValue === mission.displayName) {
      this.setState({
        confirmDeleteValue: '',
        isConfirmDeleteVisible: false
      });
      this.props.onClickDeleteMission(mission);
    }

  }

  _getVisibleMissions() {
    if (!this.props.missions) return null;

    return _.filter(this.props.missions, {type: missionConfig.PHASE_I_MISSION_TYPE});
  }

}

export default Missions
