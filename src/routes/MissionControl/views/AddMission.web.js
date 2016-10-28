
import React from 'react'

import BASE_STYLES from '../../../styles/baseStyles'

import {
  DateRangePicker
} from 'react-dates'
import 'react-dates/css/variables.scss'
import 'react-dates/css/styles.scss'

let _ = require('lodash')

let styles = {

};

export const AddMissionWeb = (props) => {

  // @Cole: need help
  // use https://github.com/airbnb/react-dates for date picking

  return (
    <div>
      <form onSubmit={() => props.onAddMission(props.newMission)}>
        <div>
          <label htmlFor="displayName">Mission Name</label>
          <input type="text"
                 value={props.newMission.displayName}
                 id="displayName"
                 onChange={(e) => props.updateMissionForm({displayName: e.target.value})} />
        </div>
        <div>
          <div>Mission Type</div>
          <label htmlFor="homework">Homework</label>
          <input type="radio"
                 value="assessment-genus%3Afbw-homework-mission%40ODL.MIT.EDU"
                 id="homework"
                 defaultChecked={true}
                 name="missionType"
                 onChange={(e) => props.updateMissionForm({genusTypeId: e.target.value})} />
          <label htmlFor="inClass">In-class</label>
          <input type="radio"
                 value="assessment-genus%3Afbw-in-class-mission%40ODL.MIT.EDU"
                 id="inClass"
                 name="missionType"
                 onChange={(e) => props.updateMissionForm({genusTypeId: e.target.value})} />
        </div>
        <div>
          <DateRangePicker onDatesChange={props.updateMissionForm}
                           onFocusChange={(input) => props.updateMissionForm({focusedInput: input})}
                           focusedInput={props.newMission.focusedInput}
                           startDate={props.newMission.startTime}
                           endDate={props.newMission.deadline} />
        </div>

        <button className="button" type="submit">Save</button>
      </form>

    </div>
  )


}
