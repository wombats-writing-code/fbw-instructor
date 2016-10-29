
import React from 'react'
import BASE_STYLES from '../../../styles/baseStyles'

import {
  DateRangePicker
} from 'react-dates'
import 'react-dates/css/variables.scss'
import 'react-dates/css/styles.scss'

import 'lodash'

require('./datepicker.css')

let styles = {
  formSection: {
    marginBottom: '1.5rem'
  },
  formLabel: {
    display: 'block',
    fontSize: '.875rem',
    color: BASE_STYLES.primaryColor,
    textAlign: 'left',
    fontWeight: "500"
  },
  textInput: {
    border: '2px solid ' + BASE_STYLES.primaryColor,
    borderRadius: '2px',
    opacity: .5,
    boxShadow: 'none',
    ':focus': {
      opacity: 1,
      boxShadow: 'none',
    }
  },
  missionTypeOptions: {
    display: 'flex',
    alignItems: 'center',
  },
  missionTypeOption: {
    marginRight: '1rem'
  },
  saveButton: {

  }
};

export const AddMissionWeb = (props) => {

  // @Cole: need help
  // use https://github.com/airbnb/react-dates for date picking

  let alert = <div />,
    save = <div />;

  if (props.newMission.formError) {
    alert = (
      <div className="formError">
        Please fill in all form data before saving.
      </div>
    )
  } else {
    save = (
      <button className="button" type="submit" style={styles.saveButton}>Save</button>
    )
  }

  return (
    <div>
      <form onSubmit={(e) => {props.onAddMission(props.newMission, props.currentBank.id); e.preventDefault();}}>
        <div style={styles.formSection}>
          <label style={styles.formLabel} htmlFor="displayName">Mission Name</label>
          <input type="text" style={styles.textInput}
                 value={props.newMission.displayName}
                 id="displayName"
                 onChange={(e) => props.updateMissionForm({displayName: e.target.value})} />
        </div>

        <div style={styles.formSection}>
          <label style={styles.formLabel}>Mission Type</label>
          <div style={styles.missionTypeOptions}>
            <div style={styles.missionTypeOption}>
              <label htmlFor="homework">Homework</label>
              <input type="radio"
                     value="assessment-genus%3Afbw-homework-mission%40ODL.MIT.EDU"
                     id="homework"
                     defaultChecked={true}
                     name="missionType"
                     onChange={(e) => props.updateMissionForm({genusTypeId: e.target.value})} />
            </div>
            <div style={styles.option}>
              <label htmlFor="inClass">In-class</label>
              <input type="radio"
                     value="assessment-genus%3Afbw-in-class-mission%40ODL.MIT.EDU"
                     id="inClass"
                     name="missionType"
                     onChange={(e) => props.updateMissionForm({genusTypeId: e.target.value})} />
             </div>
          </div>
        </div>


        <div style={styles.formSection} className="clearfix">
          <label style={styles.formLabel}>Mission Dates</label>
          <DateRangePicker style={styles.datepicker} onDatesChange={props.updateMissionForm}
                           onFocusChange={(input) => props.updateMissionForm({focusedInput: input})}
                           focusedInput={props.newMission.focusedInput}
                           startDate={props.newMission.startTime}
                           endDate={props.newMission.deadline} />
        </div>


        <div className="row">
          {alert}
          {save}
        </div>
      </form>

    </div>
  )


}
