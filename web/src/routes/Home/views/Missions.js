import React, {Component} from 'react'
import _ from 'lodash';
const moment = require('moment');
import EmptyState from '@wombats-writing-code/fbw-platform-common/components/empty-state/web/'
import LoadingBox from '@wombats-writing-code/fbw-platform-common/components/loading-box/web/'

class Missions extends Component {

  constructor() {
    super();

    this.state = {
      confirmDeleteFocus: null,
      confirmDeleteValue: '',
      isConfirmDeleteVisible: false
    }
  }

  render() {
    let props = this.props;

    let createMissionButton;
    if (!props.isGetMappingInProgress && props.missions) {
      createMissionButton = <button className="button create-mission-button"
                                    onClick={() => props.onClickAddMission()}>&#x0002B; Create a mission</button>
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
        {createMissionButton}

        <ul key="missionCollection" className="clickable-list">
          {_.map(props.missions, (mission, idx) => {
            let key = `mission_${idx}`;
            let isSelected = (props.currentMission && mission.id === props.currentMission.id);

            let editMissionButton =  (<button className="button small"
                onClick={(e) => {props.onClickEditMission(mission); e.stopPropagation()}}>
                  Edit</button>)

             let deleteMissionButton =  (<button className="button small warning"
                     onClick={(e) => {this._onClickDelete(mission); e.stopPropagation()}}>
                      Delete</button>)

            // console.log(mission, 'startTime', mission.startTime, 'deadline', mission.deadline)
            let confirmDelete = (
              <div>
                <input className="confirm-delete-input" placeholder="Type the mission name here"
                      value={this.state.confirmDeleteValue}
                      onChange={(e) => {this.setState({confirmDeleteValue: e.target.value}); e.stopPropagation()}} />

                <div className="flex-container space-between">
                  <button className="button small warning"
                          onClick={(e) => {e.stopPropagation(); this._onConfirmDeleteMission(mission)}}>
                           Confirm delete</button>

                   <button className="button small"
                           onClick={() => this.setState({isConfirmDeleteVisible: false})}>
                            Cancel</button>
                </div>
              </div>
            )


              return (
                <li key={key} className={isSelected ? "clickable-row__item is-selected" : "clickable-row__item"}
                              onClick={() => props.onClickMission(mission)}>
                  <p className="row-title">{mission.displayName}</p>
                  <p className="row-subtitle">
                    <span className="">From </span>
                    <span className="">{moment(mission.startTime).format('ddd MMM D [at] ha')} </span>
                    <span className="">to </span>
                    <b className="">{moment(mission.deadline).format('ddd MMM D [at] ha')}</b>
                  </p>

                  <div className="flex-container space-between mission-buttons">
                    {this.state.isConfirmDeleteVisible ? null : deleteMissionButton}
                    {this.state.isConfirmDeleteVisible ? null : editMissionButton}
                  </div>

                  {this.state.confirmDeleteFocus === mission ? confirmDelete : null}

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
    console.log('confirmDeleteValue', this.state.confirmDeleteValue, 'mission name', mission.displayName)

    if (this.state.confirmDeleteValue === mission.displayName) {
      this.setState({
        confirmDeleteValue: '',
        isConfirmDeleteVisible: false
      });
      this.props.onClickDeleteMission(mission);
    }

  }
}

export default Missions
