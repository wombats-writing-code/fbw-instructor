
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
  missionTypeSelect: {
    fontSize: '2rem',
    marginRight: '2rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingBottom: '.5rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#bbb',
    borderRadius: 3,
    color: '#bbb',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: BASE_STYLES.primaryColor,
      borderColor: 'transparent',
      color: '#fff'
    },
    color: '#999'
  },
  missionTypeSelectText: {
    fontSize: '1rem',
    fontWeight: '500'
  },
  missionTypeSelected: {
    backgroundColor: BASE_STYLES.primaryColor,
    color: '#fff',
    borderColor: 'transparent',
    cursor: 'default'
  },
  saveButton: {
    marginLeft: 0,
    display: 'block',
    marginRight: 'auto',
    width: '8rem'
  }
};

export const AddMissionWeb = (props) => {

  if (!props.newMission) return;

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
// TODO: Add "add directive" controls
  console.log('genusTypeId', props.newMission.genusTypeId)


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
            <div key='homework'
                  style={[styles.missionTypeSelect, (props.newMission.genusTypeId === 'assessment-genus%3Afbw-homework-mission%40ODL.MIT.EDU') ? styles.missionTypeSelected : null]}
                  onClick={() => props.updateMissionForm({genusTypeId: 'assessment-genus%3Afbw-homework-mission%40ODL.MIT.EDU'})}>
              &#x02A2F;  <span style={styles.missionTypeSelectText}>Preflight</span>
            </div>
            <div key='in-class'
                  style={[styles.missionTypeSelect, (props.newMission.genusTypeId === 'assessment-genus%3Afbw-in-class-mission%40ODL.MIT.EDU') ? styles.missionTypeSelected : null]}
                  onClick={() => props.updateMissionForm({genusTypeId: 'assessment-genus%3Afbw-in-class-mission%40ODL.MIT.EDU'})}>
              &#x02A2F; <span style={styles.missionTypeSelectText}>Testflight</span>
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


        <div className="">
          {alert}
          {save}
        </div>
      </form>

    </div>
  )


}
