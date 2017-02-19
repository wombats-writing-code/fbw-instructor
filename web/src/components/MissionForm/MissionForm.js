import React, {Component} from 'react'

import EmptyState from '../../components/EmptyState'
import LoadingBox from '../../components/LoadingBox'
import SelectDirectives from './views/SelectDirectives';

import { DateRangePicker } from 'react-dates'
import 'react-dates/css/variables.scss'
import 'react-dates/css/styles.scss'

import _ from 'lodash'
// require('./datepicker.css')
import './MissionForm.scss'

class MissionForm extends Component {

  componentDidMount() {
  }

  render() {
    let props = this.props;
    // console.log('props of missionform', props)

    if (!props.newMission || !props.mapping) return null;

    let loadingBox;
    if (props.isCreateMissionInProgress) {
      loadingBox = LoadingBox('enter-active');
    } else {
      loadingBox = LoadingBox('enter');
    }

    let form;
    let buttonText = props.view.name === 'edit-mission' ? "Save mission" : "Create mission";
    if (!props.isCreateMissionInProgress) {
      form = (
        <form onSubmit={(e) => {
              e.preventDefault();
              props.view.name === 'edit-mission' ?
                props.onUpdateMission(props.newMission, props.currentCourse)
                : props.onCreateMission(props.newMission, props.currentCourse, 'PHASE_I_MISSION_TYPE');
        }}>
          <div className="form-section">
            <label className="form-label" htmlFor="displayName">Mission Name</label>

            <input type="text" className="mission-name-input"
                   value={props.newMission.displayName}
                   placeholder="My new mission name"
                   id="displayName"
                   onChange={(e) => props.updateMissionForm({displayName: e.target.value})} />
         </div>

         <div className="form-section clearfix">
            <label className="form-label">Dates</label>
            <DateRangePicker className="" onDatesChange={props.updateMissionForm}
                             onFocusChange={(input) => props.updateMissionForm({focusedInput: input})}
                             focusedInput={props.newMission.focusedInput}
                             startDate={props.newMission.startTime}
                             endDate={props.newMission.deadline} />
          </div>


          <div className="form-section">
            <label className="form-label">Goals</label>
            <SelectDirectives {...props} />
          </div>

          <div className="">
            {alert}
            <button className="button create-mission-button" type="submit">{buttonText}</button>
          </div>

        </form>
      )
    }


    return (
      <div className="mission-form">
        {form}
        {loadingBox}
      </div>
    )
  }
}

export default MissionForm
