import React, {Component} from 'react'
import moment from 'moment'
import _ from 'lodash'
import {browserHistory} from 'react-router'

import Datetime from 'react-datetime'
require('./react-datetime.css')

import EmptyState from '@wombats-writing-code/fbw-platform-common/components/empty-state/web/EmptyState'
import LoadingBox from '@wombats-writing-code/fbw-platform-common/components/loading-box/web/LoadingBox'
import {missionConfig} from '@wombats-writing-code/fbw-platform-common/reducers/Mission'
import {getD2LDisplayName, getD2LUserIdentifier} from '@wombats-writing-code/fbw-platform-common/selectors/login'

import PhaseIBody from './views/PhaseIBody'
import PhaseIIBody from './views/PhaseIIBody'

import SelectMissionType from './views/SelectMissionType';

import './MissionEdit.scss'

class MissionEdit extends Component {

  componentDidMount() {
  }

  render() {
    let props = this.props;

    if (!props.newMission || !props.mapping) return null;

    let loadingBox;
    if (props.isCreateMissionInProgress) {
      loadingBox = LoadingBox('enter-active');
    } else {
      loadingBox = LoadingBox('enter');
    }

    // console.log('mission form props', props);
    // console.log('newMission prop of missionform', props.newMission);
    // console.log('displayedDirectives', props.displayedDirectives)

    let body;
    if (props.newMission.type === missionConfig.PHASE_I_MISSION_TYPE) {
      body = <PhaseIBody {...props} />
    } else {
      body = <PhaseIIBody {...props} />
    }

    let form;
    if (!props.isCreateMissionInProgress && props.newMission.type) {
      const creatingMission = props.editView !== 'edit';
      let buttonText = creatingMission ? "Create mission" : "Save & update mission";
      let dateInputs;

      if (props.newMission.type === missionConfig.PHASE_I_MISSION_TYPE) {
        // If creating / editing a new Phase I mission, need to have 4 date fields.
        //   Two for the Phase I, two for the Phase II.
        dateInputs = (
          <div className="form-section">
            <label className="form-label">Attempt 1 Dates</label>
            <div className="row">
              <div className="datetime medium-6 columns">
                <Datetime inputProps={{placeholder: "Attempt 1 start date & time"}}
                         value={moment(props.newMission.startTime)}
                         dateFormat={true}
                         onChange={(momentObj) => this.props.onChangeMissionStart(momentObj)}  />
              </div>
              <div className="datetime medium-6 columns">
                <Datetime inputProps={{placeholder: "Attempt 1 deadline date & time"}}
                          value={moment(props.newMission.deadline)}
                         dateFormat={true} onChange={(momentObj) => this.props.onChangeMissionEnd(momentObj)}  />
              </div>
            </div>
            <div className="divider-row" />
            <label className="form-label">Attempt 2 Dates</label>
            <div className="row">
              <div className="datetime medium-6 columns">
                <Datetime inputProps={{placeholder: "Attempt 2 start date & time"}}
                         value={moment(props.newMission.leadsToMissionsStartTime || null)}
                         dateFormat={true}
                         onChange={(momentObj) => this.props.onChangeMissionLeadsToStartTime(momentObj)}  />
              </div>
              <div className="datetime medium-6 columns">
                <Datetime inputProps={{placeholder: "Attempt 2 deadline date & time"}}
                         value={moment(props.newMission.leadsToMissionsDeadline || null)}
                         dateFormat={true}
                         onChange={(momentObj) => this.props.onChangeMissionLeadsToEnd(momentObj)}  />
              </div>
            </div>
          </div>
        );
      } else {
        // Otherwise, just have two date fields
        dateInputs = (
          <div className="form-section">
            <label className="form-label">Dates</label>
            <div className="row">
              <div className="datetime medium-6 columns">
                <Datetime inputProps={{placeholder: "Start date & time"}}
                         value={moment(props.newMission.startTime)}
                         dateFormat={true}
                         onChange={(momentObj) => this.props.onChangeMissionStart(momentObj)}  />
              </div>
              <div className="datetime medium-6 columns">
                <Datetime inputProps={{placeholder: "Deadline date & time"}}
                          value={moment(props.newMission.deadline)}
                         dateFormat={true} onChange={(momentObj) => this.props.onChangeMissionEnd(momentObj)}  />
              </div>
            </div>
          </div>
        );
      }

      form = (
        <form className="mission-form" onSubmit={(e) => this._onSubmitForm(e)}>
          {dateInputs}

          {body}

          <div className="">
            <button className="button create-mission-button" type="submit" disabled={!this._canSubmit()}>{buttonText}</button>
          </div>

        </form>
      )
    }

    let selectMissionType;
    let editMissionTitle;
    if (props.editView !== 'edit') {
      selectMissionType = <SelectMissionType
        mission={props.newMission}
        onChangeMissionType={props.onChangeMissionType} />
    } else if (props.newMission.displayName) {
      editMissionTitle = <p>Editing {props.newMission.displayName}</p>
    } else {
      editMissionTitle = <p>Changes saved!</p>
    }

    return (
      <div className="mission-edit medium-12 large-8 medium-centered columns">
        <div className="row">
          <button className="button go-back-button" onClick={() => this._onClickCancel()}>&larr; Go back</button>
        </div>
        {selectMissionType}
        {editMissionTitle}

        {form}
        {loadingBox}
      </div>
    )
  }

  _canSubmit() {
    if (this.props.newMission.type === missionConfig.PHASE_II_MISSION_TYPE &&
        this.props.newMission.displayName &&
        this.props.newMission.startTime &&
        this.props.newMission.deadline) {
      return true;
    }

    if (this.props.newMission.type === missionConfig.PHASE_I_MISSION_TYPE &&
        this.props.newMission.displayName &&
        this.props.newMission.startTime &&
        this.props.newMission.deadline &&
        this.props.newMission.leadsToMissionsDeadline) {
      return true;
    }

    return false;
  }

  _onSubmitForm(e) {
    e.preventDefault();
    let props = this.props;

    if (!props.newMission.startTime) {
      return this.setState({startTimeError: 'You must set a startTime'})
    }

    if (!props.newMission.deadline) {
      return this.setState({deadlineError: 'You must set a deadline'})
    }

    if (props.newMission.type === missionConfig.PHASE_I_MISSION_TYPE && props.newMission.goals.length === 0) {
      return this.setState({goalsError: 'You must choose at least 1 goal for Attempt 1.'})
    }

    if (props.newMission.type === missionConfig.PHASE_I_MISSION_TYPE &&
        !props.newMission.leadsToMissionsDeadline) {
      return this.setState({deadlineError: 'You must set an Attempt 2 deadline.'})
    }

    if (props.newMission.type === missionConfig.PHASE_I_MISSION_TYPE &&
        !props.newMission.leadsToMissionsStartTime) {
      return this.setState({startTimeError: 'You must set an Attempt 2 start time.'})
    }

    if (props.editView === 'edit') {
      if (props.newMission.type === missionConfig.PHASE_I_MISSION_TYPE) {
        props.onUpdateMission(props.newMission, props.user);

      } else {
        throw new Error('Unimplemented. You need to write code to update ALL Attempt 2\'s');

        // need to get every phase II mission that this Phase I mission leads to
        // let newMissions = _.map(props.recommendations, rec => {
        //   return _.assign({}, props.newMission, {
        //     displayName: `Phase II (from ${followsFromMissionNames.join(' + ')})`,
        //     description: `for ${getD2LDisplayName(rec.student)}`,
        //     goals: rec.goals,
        //     userId: getD2LUserIdentifier(rec.student)
        //   })
        // });
        // props.onUpdateMissions();

        return;
      }

    } else {
      if (props.newMission.type === missionConfig.PHASE_I_MISSION_TYPE) {
        props.onCreateMission(props.newMission, props.currentCourse, props.user);

      } else {
        let followsFromMissionNames = _.map(props.newMission.followsFromMissions, id => {
          return _.find(props.missions, {id: id}).displayName
        });

        // using this newMission form, stamp out a mission for each student recommendation
        let newMissions = _.map(props.recommendations, rec => {
          return _.assign({}, props.newMission, {
            displayName: `Attempt 2 (from ${followsFromMissionNames.join(' + ')})`,
            description: `for ${getD2LDisplayName(rec.student)}`,
            goals: rec.goals,
            userId: getD2LUserIdentifier(rec.student)
          })
        });

        // console.log('props.newMission', props.newMission);
        // console.log('props.recs', props.recommendations);
        // console.log('newMissions', newMissions)

        props.onCreateMissions(newMissions, props.currentCourse, props.user);
      }
    }
  }

  _onClickCancel() {
    browserHistory.push('/missions');
  }
}

export default MissionEdit
