import React, {Component} from 'react';
import {browserHistory} from 'react-router'
import slug from 'slug'
import moment from 'moment'
import _ from 'lodash'
import Modal from 'react-modal'
import Datetime from 'react-datetime'
// require('./react-datetime.css')

import {missionConfig} from 'fbw-platform-common/reducers/Mission'
import {getD2LDisplayName, getD2LDisplayNameLastFirst} from 'fbw-platform-common/selectors/login'

import './EditPhaseII.scss'

class EditPhaseII extends Component {

  constructor() {
    super();

    this.state = {
      isConfirmDeleteVisible: false,
      confirmDeleteValue: ''
    }
  }

  render() {
    let props = this.props;

    if (!props.mission || !props.mission.course) return null;

    // console.log('props.roster', props.roster)

    // let student = _.find(props.roster, {id: props.mission.user});
    let student = _.find(props.roster, {id: props.mission.user});

    // console.log('student', student)


    let confirmDelete;
    if (this.state.isConfirmDeleteVisible) {
        confirmDelete = (
          <div className="flex-container space-between align-center">
            <input className="input edit-phase-II__confirm-delete-input" type="text" placeholder="Paste the name of student, e.g. Susan Smith, to confirm"
                  value={this.state.confirmDeleteValue}
                  onChange={e => this.setState({confirmDeleteValue: e.target.value})} />
            <button className="button edit-phase-II__confirm-delete warning" disabled={props.isDeleteMissionInProgress}
                    onClick={() => this._onConfirmDelete(props.mission, student)}>
              {props.isDeleteMissionInProgress ? 'Working...' : 'Confirm delete'}
            </button>
          </div>
        )
    }

    let initialDelete = (
      <button className="button edit-phase-II__delete text" disabled={props.isDeleteMissionInProgress}
              onClick={() => this.setState({isConfirmDeleteVisible: !this.state.isConfirmDeleteVisible})}>
        {this.state.isConfirmDeleteVisible ? 'Never mind' : 'Delete'}
      </button>
    )

    return (
      <Modal isOpen={props.mission ? true : false} contentLabel="edit-phase-II-mission-modal">
        <p className="columns edit-phase-II__title">
          {props.mission.displayName}
          <span className="mute"> for </span>
          <b>{getD2LDisplayName(student)}</b>
        </p>
        <div className="row">
          <label className="form-label columns">Dates</label>
          <div className="">
            <div className="datetime medium-6 columns">
              <Datetime inputProps={{placeholder: "Start date & time"}}
                       value={moment(props.mission.startTime)}
                       dateFormat={true}
                       onChange={(momentObj) => props.onChangeMissionStart(momentObj)}  />
            </div>
            <div className="datetime medium-6 columns">
              <Datetime inputProps={{placeholder: "Deadline date & time"}}
                        value={moment(props.mission.deadline)}
                       dateFormat={true} onChange={(momentObj) => props.onChangeMissionEnd(momentObj)}  />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="columns edit-phase-II__goals">
            <p className="form-label">Goals</p>
            <ol>
              {_.map(props.mission.goals, (outcomeId, idx) => {
                let outcome = _.find(props.outcomes, {id: outcomeId});

                return (
                  <li key={`edit-phase-II__goal-${idx}`}>
                    <p className="edit-phase-II__goal-name">{outcome ? outcome.displayName : ''}</p>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
        <div className="row">
          <div className="small-12 medium-9 columns flex-container space-around align-center">
            {initialDelete}
            {confirmDelete}
          </div>

          <div className="small-12 medium-3 columns flex-container space-between">
            <button className="button edit-phase-II__cancel transparent text" onClick={() => props.onClickCancel()}>
              Cancel
            </button>
            <button className="button edit-phase-II__save" disabled={props.isUpdateMissionInProgress}
                    onClick={() => props.onSave(props.mission)}>
              {props.isUpdateMissionInProgress ? 'Working...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  _onConfirmDelete(mission, student) {
    if (this.state.confirmDeleteValue === getD2LDisplayName(student)) {
      this.props.onDelete(mission);
    }
  }

}

export default EditPhaseII
