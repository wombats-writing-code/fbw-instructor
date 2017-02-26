import React, {Component} from 'react'
import moment from 'moment'
import _ from 'lodash'

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import Datetime from 'react-datetime'
require('./react-datetime.css')

import EmptyState from 'fbw-platform-common/components/empty-state/web/EmptyState'
import LoadingBox from 'fbw-platform-common/components/loading-box/web/LoadingBox'
import {missionConfig} from 'fbw-platform-common/reducers/Mission'
import {getD2LDisplayName, getD2LUserIdentifier} from 'fbw-platform-common/selectors/login'
import SelectDirectives from './views/SelectDirectives';

import './MissionForm.scss'

class MissionForm extends Component {

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

    let missionName, goalsForMission, composeMissions;
    if (props.newMission.type === missionConfig.PHASE_I_MISSION_TYPE) {
      missionName = (
        <div className="form-section">
          <div className="columns">
            <input type="text" className="mission-form__input"
                   value={props.newMission.displayName}
                   placeholder="My new mission name"
                   id="displayName"
                   onChange={(e) => props.onChangeMissionName(e.target.value)} />
          </div>
        </div>
      )

      goalsForMission = (
        <div>
          <label className="form-label">Goals</label>
          <SelectDirectives selectedOutcomeIds={props.newMission.goals}
                            selectedModule={props.selectedModule}
                            displayedDirectives={props.displayedDirectives}
                            numberItemsForDirectives={props.numberItemsForDirectives}
                            mapping={props.mapping}
                            outcomeQuery={props.outcomeQuery}
                            onSelectModule={props.onSelectModule}
                            onChangeOutcomeSearch={props.onChangeOutcomeSearch}
                            onToggleOutcome={props.onToggleOutcome}/>
        </div>
      )

    } else {
      goalsForMission = (
        <div>
          <label className="form-label">Recommendations for students</label>
          <ol>
            {_.map(props.recommendations, (rec, idx) => {
              return (
                <li key={`rec-${idx}`} className="recommendation">
                  <p>
                    <span>{getD2LDisplayName(rec.student)}</span>
                    <span> will get {rec.goals.length} directives (~{rec.goals.length*3} questions)</span>
                  </p>
                </li>
              )
            })}
          </ol>
        </div>
      )

      composeMissions = (
        <div className="form-section compose-missions">
          <p className="small">
            Phase II missions pick goals that students missed in previous missions.
            Pick one or more of these previous missions:
          </p>
          <Select
              value={props.newMission.followsFromMissions}
              name="displayName"
              options={props.missions}
              multi={true}
              matchProp="displayName"
              labelKey="displayName"
              valueKey="id"
              onChange={(value) => props.onSelectFollowFromMissions(value, props.user)}
          />
        </div>
      )
    }


    let form;
    let buttonText = props.view.name === 'edit-mission' ? "Save mission" : "Create mission";
    if (!props.isCreateMissionInProgress && props.newMission.type) {
      form = (
        <form className="mission-form" onSubmit={(e) => this._onSubmitForm(e)}>

        {composeMissions}

        {missionName}

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
               <Datetime inputProps={{placeholder: "Start date & time"}}
                         value={moment(props.newMission.deadline)}
                        dateFormat={true} onChange={(momentObj) => this.props.onChangeMissionEnd(momentObj)}  />
             </div>
           </div>
         </div>


          <div className="form-section">
            {goalsForMission}
          </div>

          <div className="">
            <button className="button create-mission-button" type="submit">{buttonText}</button>
          </div>

        </form>
      )
    }

    let isSelectedStyle = "is-selected"

    return (
      <div className="mission-form">
        <div className="flex-container space-around align-center form-section">
          <p className="mission-type-prompt">Select the type of mission</p>
          <button className={`mission-type-button button ${props.newMission.type === missionConfig.PHASE_I_MISSION_TYPE ? isSelectedStyle : null}`}
                  onClick={() => this.props.onChangeMissionType(missionConfig.PHASE_I_MISSION_TYPE)}>
            Phase I Mission
          </button>
          <button className={`mission-type-button button ${props.newMission.type === missionConfig.PHASE_II_MISSION_TYPE ? isSelectedStyle : null}`}
                  onClick={() => this.props.onChangeMissionType(missionConfig.PHASE_II_MISSION_TYPE)}>
            Phase II Mission
          </button>
        </div>

        {form}
        {loadingBox}
      </div>
    )
  }

  _onSubmitForm(e) {
    e.preventDefault();
    let props = this.props;

    // if (!props.newMission.startTime) {
    //   this.setState({startTimeError: 'You must set a startTime'})
    //   return;
    // }

    if (props.view.name === 'edit-mission') {
      props.onUpdateMission(props.newMission, props.user);

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
            displayName: `Phase II (from ${followsFromMissionNames.join(' + ')})`,
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
}

export default MissionForm
