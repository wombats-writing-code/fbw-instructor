import React, {Component} from 'react'
import moment from 'moment'
import EmptyState from '../../components/EmptyState'
import LoadingBox from '../../components/LoadingBox'
import SelectDirectives from './views/SelectDirectives';
import {missionConfig} from 'fbw-platform-common/reducers/mission'
import {getD2LDisplayName} from 'fbw-platform-common/selectors/login'

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import Datetime from 'react-datetime'
require('./react-datetime.css')

import _ from 'lodash'
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

    console.log('mission form props', props);
    // console.log('newMission prop of missionform', props.newMission);
    // console.log('displayedDirectives', props.displayedDirectives)

    let missionName, goalsForMission, composeMissions;
    if (props.newMission.type === missionConfig.PHASE_I_MISSION_TYPE) {
      missionName = (
        <input type="text" className="mission-form__input"
               value={props.newMission.displayName}
               placeholder="My new mission name"
               id="displayName"
               onChange={(e) => props.onChangeMissionName(e.target.value)} />
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
      missionName = (
        <p>{props.newMission.displayName}</p>
      )

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
            Phase II missions automatically pick goals that students missed in previous missions.
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
              onChange={(value) => props.onSelectFollowFromMissions(value)}
          />
        </div>
      )
    }


    let form;
    let buttonText = props.view.name === 'edit-mission' ? "Save mission" : "Create mission";
    if (!props.isCreateMissionInProgress) {
      form = (
        <form className="mission-form" onSubmit={(e) => {
              e.preventDefault();
              props.view.name === 'edit-mission' ?
                props.onUpdateMission(props.newMission, props.currentCourse, props.user) :
                props.onCreateMission(props.newMission, props.currentCourse, props.user);
        }}>

        {composeMissions}

         <div className="form-section">
            <label className="form-label" htmlFor="displayName">Mission Name</label>
            {missionName}
         </div>

         <div className="form-section">
           <label className="form-label">Dates</label>
           <div className="row">
             <div className="datetime medium-6 columns">
               <Datetime inputProps={{placeholder: "Start date & time"}}
                        dateFormat={true} onChange={(momentObj) => this.props.onChangeMissionStart(momentObj)}  />
             </div>
             <div className="datetime medium-6 columns">
               <Datetime inputProps={{placeholder: "Start date & time"}}
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
        <div className="flex-container space-around">
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
}

export default MissionForm
