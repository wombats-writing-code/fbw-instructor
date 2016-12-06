
import React from 'react'
import BASE_STYLES from '../../../styles/baseStyles'

import EmptyState from '../../../components/EmptyState'
import LoadingBox from '../../../components/LoadingBox'
import SelectDirectives from './SelectDirectives';

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
    fontWeight: "600"
  },
  formSubLabelRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  formSubLabel: {
    fontSize: '.875rem',
    color: BASE_STYLES.primaryColorDark,
    textAlign: 'left',
    marginTop: '1.125rem',
    fontWeight: "600",
    flex: 1
  },
  textInput: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#bbb',
    borderRadius: 1,
    paddingLeft: '.75em',
    opacity: 1,
    boxShadow: 'none',
    ':focus': {
      borderColor: BASE_STYLES.primaryColor,
      boxShadow: 'none',
    },
    height: 50
  },
  selectFromLists: {
    display: 'flex',
  },
  selectList: {
    borderLeftWidth: 1,
    borderLeftStyle: 'solid',
    borderLeftColor: '#ddd',
    fontSize: '.875rem',
    marginLeft: 0,
    listStyle: 'none',
    textAlign: 'left',
    flex: 1
  },
  modulesList: {
    borderLeftWidth: 0
  },
  outcomesList: {
    flex: 2,
  },
  listItem: {
    paddingLeft: '1em',
    paddingRight: '1em',
    paddingTop: '.75rem',
    paddingBottom: '.625rem',
    // borderBottom: '1px solid #ddd',
    ':hover': {
      backgroundColor: '#f0f0f0'
    },
    cursor: 'pointer'
  },
  listItemSelected: {
    backgroundColor: '#f0f0f0',
    cursor: 'default'
  },
  directiveItem: {
    cursor: 'default'
  },
  selectDirectiveIcon: {
    fontFamily: 'sans-serif',
    display: 'inline-block',
    textAlign: 'center',
    width: 30,
    height: 30,
    fontSize: 20,
    marginRight: '1rem',
    cursor: 'pointer',
    ':hover': {
      color: BASE_STYLES.primaryColor
    }
  },
  selectedDirectives: {
    // marginLeft: 0,
    // listStyle: 'none',
    textAlign: 'left',
    fontSize: '.875rem',
    flex: 2
  },
  selectedDirective: {
    marginBottom: '.125rem'
  },
  saveButton: {
    marginLeft: 0,
    display: 'block',
    marginRight: 'auto',
    width: '100%'
  },
  selectedDirectiveItemCount: {
    color: '#666',
    fontWeight: "600",
    textAlign: 'right',
  }
};

export default function(props) {

  if (!props.newMission) return;

  let alert = <div />;
  if (props.newMission.formError) {
//    alert = (
      // This should really be put back in ... after the demo?
        // after the demo.
//       <div className="formError">
//         Please fill in all form data before saving.
//       </div>
//    )
  } else {
  }

  let loadingBox;
  if (props.isCreateMissionInProgress) {
    loadingBox = LoadingBox('enter-active');
  } else {
    loadingBox = LoadingBox('enter');
  }

  let form;
  if (!props.isCreateMissionInProgress) {
    form = (
      <form onSubmit={(e) => {e.preventDefault(); props.onAddMission(props.newMission, props.currentBank.id, props.numberItemsForDirectives, props.itemBankId); e.preventDefault();}}>
        <div className="row">
          <div className="medium-6 columns" style={styles.formSection}>
            <label style={styles.formLabel} htmlFor="displayName">Mission Name</label>
            <input type="text" style={styles.textInput}
                   value={props.newMission.displayName}
                   id="displayName"
                   onChange={(e) => props.updateMissionForm({displayName: e.target.value})} />
          </div>

          <div className="medium-6 columns clearfix" style={styles.formSection}>
            <label style={styles.formLabel}>Dates</label>
            <DateRangePicker style={styles.datepicker} onDatesChange={props.updateMissionForm}
                             onFocusChange={(input) => props.updateMissionForm({focusedInput: input})}
                             focusedInput={props.newMission.focusedInput}
                             startDate={props.newMission.startTime}
                             endDate={props.newMission.deadline} />
          </div>
        </div>


        <div style={styles.formSection}>
          <SelectDirectives {...props} />
        </div>

        <div className="">
          {alert}
          <button className="button" type="submit" style={styles.saveButton}>Create mission</button>
        </div>

      </form>
    )
  }

  return (
    <div>
      {form}
      {loadingBox}
    </div>
  )


}
