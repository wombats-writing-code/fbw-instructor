
import React from 'react'

import { DateRangePicker } from 'react-dates'
import 'react-dates/css/variables.scss'
import 'react-dates/css/styles.scss'


export default function(props) {

  let alert = <div />,
    save = <div />;

  if (props.editMission.formError) {
    alert = (
      <div className="formError">
        Please fill in all form data before saving.
      </div>
    )
  } else {
    save = (
      <button className="button" type="submit">Save</button>
    )
  }

  return (
    <div>
      <form onSubmit={(e) => {props.onUpdateMission(props.editMission, props.currentBank.id); e.preventDefault();}}>
        <div>
          <label htmlFor="displayName">Mission Name</label>
          <input type="text"
                 value={props.editMission.displayName}
                 id="displayName"
                 onChange={(e) => props.updateEditMissionForm({displayName: e.target.value})} />
        </div>
        <div>
          <div>Mission Type</div>
          <div className="row">
            <label htmlFor="homework">Homework</label>
            <input type="radio"
                   value="assessment-genus%3Afbw-homework-mission%40ODL.MIT.EDU"
                   id="homework"
                   defaultChecked={true}
                   name="missionType"
                   onChange={(e) => props.updateEditMissionForm({genusTypeId: e.target.value})} />
            <label htmlFor="inClass">In-class</label>
            <input type="radio"
                   value="assessment-genus%3Afbw-in-class-mission%40ODL.MIT.EDU"
                   id="inClass"
                   name="missionType"
                   onChange={(e) => props.updateEditMissionForm({genusTypeId: e.target.value})} />
          </div>
        </div>
        <div>
          <DateRangePicker onDatesChange={props.updateEditMissionForm}
                           onFocusChange={(input) => props.updateEditMissionForm({focusedInput: input})}
                           focusedInput={props.editMission.focusedInput}
                           startDate={props.editMission.startTime}
                           endDate={props.editMission.deadline} />
        </div>
        {alert}
        {save}
      </form>

    </div>
  )

}
