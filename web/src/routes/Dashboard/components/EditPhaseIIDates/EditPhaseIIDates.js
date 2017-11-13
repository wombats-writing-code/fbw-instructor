import React, {Component} from 'react';
import {browserHistory} from 'react-router'
import slug from 'slug'
import moment from 'moment'
import _ from 'lodash'
import Modal from 'react-modal'
import Datetime from 'react-datetime'
// require('./react-datetime.css')

import {missionConfig} from '@wombats-writing-code/fbw-platform-common/reducers/Mission'
import {getD2LDisplayName, getD2LDisplayNameLastFirst} from '@wombats-writing-code/fbw-platform-common/selectors/login'

import './EditPhaseIIDates.scss'

class EditPhaseIIDates extends Component {

  constructor() {
    super();

    this.state = {
    }
  }

  render() {
    let props = this.props;

    if (!props.mission || !props.mission.course) return null;

    // console.log('props.roster', props.roster)

    return (
      <Modal isOpen={props.mission ? true : false} contentLabel="edit-phase-II-mission-modal">
        <p className="columns edit-phase-II__title">
          Edit All Phase II Dates
        </p>
        <div className="row">
          <p>NOTE: This overrides any existing Phase II Dates.
            If you want to grant individual student exceptions,
            change those dates manually AFTER using this form.</p>
        </div>
        <div className="row">
          <label className="form-label columns">Dates</label>
          <div className="">
            <div className="datetime medium-6 columns">
              <Datetime
                inputProps={{ placeholder: "Start date & time" }}
                value={moment(props.mission.startTime)}
                dateFormat
                onChange={(momentObj) => props.onChangeMissionStart(momentObj)}
              />
            </div>
            <div className="datetime medium-6 columns">
              <Datetime
                inputProps={{ placeholder: "Deadline date & time" }}
                value={moment(props.mission.deadline)}
                dateFormat
                onChange={(momentObj) => props.onChangeMissionEnd(momentObj)}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="small-12 medium-3 columns flex-container space-between">
            <button className="button edit-phase-II__cancel transparent text" onClick={() => props.onClickCancel()}>
              Cancel
            </button>
            <button className="button edit-phase-II__save" disabled={props.isUpdateMissionInProgress}
                    onClick={() => this._onSave()}>
              {props.isUpdateMissionInProgress ? 'Working...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  _onSave = () => {
    // We need to massage this a bit, because we are going to bulk
    //   update all the Phase II's.
    // The mission sent here is the Phase I. We need to find
    //   all the Phase II's and construct the list of missions
    //   to pass along. The output missions need to each include
    //   an `id` and `startTime` or `deadline`.
    let missions = []
    const phase2missions = _.filter(this.props.missions, mission => _.indexOf(mission.followsFromMissions, this.props.mission.id) >= 0)
    if (phase2missions) {
      missions = _.map(phase2missions, phase2mission => {
        return _.assign({}, phase2mission, {
          startTime: this.props.mission.startTime,
          deadline: this.props.mission.deadline
        })
      })
    }
    this.props.onSave(missions)
  }

}

export default EditPhaseIIDates
