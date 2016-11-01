
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
    justifyContent: 'space-between'
  },
  missionTypeSelect: {
    width: '48%',
    fontSize: '2rem',
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
  selectFromLists: {
    display: 'flex',
  },
  selectList: {
    fontSize: '.875rem',
    marginLeft: 0,
    listStyle: 'none',
    textAlign: 'left',
    flex: 1
  },
  outcomesList: {
    flex: 2,
  },
  listItem: {
    paddingLeft: '1em',
    paddingRight: '1em',
    paddingTop: '.75rem',
    paddingBottom: '.625rem',
    borderBottom: '1px solid #ddd',
    ':hover': {
      backgroundColor: '#f8f8f8'
    },
    cursor: 'pointer'
  },
  listItemSelected: {
    backgroundColor: '#f8f8f8',
    cursor: 'default'
  },
  selectedDirectives: {
    marginLeft: 0,
    listStyle: 'none',
    textAlign: 'left',
    fontSize: '.875rem',
    flex: 2
  },
  selectedDirective: {

  },
  saveButton: {
    marginLeft: 0,
    display: 'block',
    marginRight: 'auto',
    width: '8rem'
  },
  selectedDirectiveItemCount: {
    marginRight: 8
  }
};

export const AddMissionWeb = (props) => {

  if (!props.newMission) return;

  let alert = <div />;
  if (props.newMission.formError) {
    // alert = (
    //   <div className="formError">
    //     Please fill in all form data before saving.
    //   </div>
    // )
  } else {
  }
// TODO: Add "add directive" controls cjshaw
  let selectDirectives;
  if (props.newMission.selectedModule && props.newMission.selectedDirectives) {
    selectDirectives = (<ul style={[styles.selectList, styles.outcomesList]}>
      {_.map(props.newMission.selectedModule.children, (outcome, idx) => {
        let isSelected = _.find(props.newMission.selectedDirectives, (item) => item.outcome === outcome);
        return (
          <li key={`selectOutcome_${idx}`} style={[styles.listItem, isSelected ? styles.listItemSelected : null]}
              onClick={(e) => props.updateMissionForm({toggledDirective: {outcome, numberItems: props.numberItemsForDirectives[outcome.id]}})}>
            {outcome.displayName.text}
          </li>
        )
      })}
    </ul>)
  }

  let selectedDirectives;
  if (props.newMission.selectedDirectives) {
    selectedDirectives = (<ul style={styles.selectedDirectives}>
      {_.map(props.newMission.selectedDirectives, (item, idx) => {
        let outcome = item.outcome;
        return (
          <li key={`selectedDirective_${idx}`} style={styles.selectedDirective}>
            <span style={styles.selectedDirectiveItemCount}>{props.numberItemsForDirectives[outcome.id] || 0}</span>
            <span>{outcome.displayName.text}</span>
          </li>
        )
      })}
    </ul>)
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
          <label style={styles.formLabel}>Dates</label>
          <DateRangePicker style={styles.datepicker} onDatesChange={props.updateMissionForm}
                           onFocusChange={(input) => props.updateMissionForm({focusedInput: input})}
                           focusedInput={props.newMission.focusedInput}
                           startDate={props.newMission.startTime}
                           endDate={props.newMission.deadline} />
        </div>

        <div style={styles.formSection} className="clearfix">
          <label style={styles.formLabel}>Selected directives</label>


          <div style={styles.selectFromLists}>
            {selectedDirectives}

            <ol style={[styles.selectList]}>
              {_.map(props.moduleTree.children, (m, idx) => {
                let selectedStyle = props.newMission.selectedModule === m ? styles.listItemSelected : null;
                return (
                  <li key={`selectModule_${idx}`} style={[styles.listItem, selectedStyle]}
                      onClick={(e) => props.updateMissionForm({selectedModule: m})}>{m.displayName}
                  </li>
                )
              })}
            </ol>

            {selectDirectives}
          </div>
        </div>


        <div className="">
          {alert}
          <button className="button" type="submit" style={styles.saveButton}>Create mission</button>
        </div>

      </form>

    </div>
  )


}
