
import React from 'react'
import BASE_STYLES from '../../../styles/baseStyles'

import EmptyState from '../../../components/EmptyState'
import LoadingBox from '../../../components/LoadingBox'


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

export const AddMissionWeb = (props) => {
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

  let selectDirectives;
  if (props.newMission.selectedModule && props.newMission.selectedDirectives) {
    selectDirectives = (<ul style={[styles.selectList, styles.outcomesList]}>
      {_.map(props.newMission.selectedModule.children, (outcome, idx) => {
        let isSelected = _.find(props.newMission.selectedDirectives, (item) => item.outcome === outcome);
        let selectDirectiveIcon = isSelected ?
                                  (<span key={`icon_${idx}`} style={styles.selectDirectiveIcon}>&#x02296;</span>) :
                                  (<span key={`icon_${idx}`} style={styles.selectDirectiveIcon}>&oplus;</span>);

        return (
          <li key={`selectOutcome_${idx}`} style={[styles.listItem, isSelected ? styles.listItemSelected : null]}
              onClick={(e) => props.updateMissionForm({toggledDirective: {outcome, numberItems: props.numberItemsForDirectives[outcome.id]}})}>

            {selectDirectiveIcon}
            {outcome.displayName.text}
          </li>
        )
      })}
    </ul>)
  }

  let selectedDirectives;
  if (props.newMission.selectedDirectives) {
    selectedDirectives = (<ol style={styles.selectedDirectives}>
      {_.map(props.newMission.selectedDirectives, (item, idx) => {
        let outcome = item.outcome;
        return (
          <li key={`selectedDirective_${idx}`} style={styles.selectedDirective}>
            <span>{outcome.displayName.text} </span>&nbsp;
            (<span style={styles.selectedDirectiveItemCount}>{props.numberItemsForDirectives[outcome.id] || 0}</span>)
          </li>
        )
      })}
    </ol>)
  } else {

    selectedDirectives = EmptyState("You haven't selected a directive. Click on a module below to find a directive.")
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

          <div className="clearfix" >
            <label style={styles.formLabel}>Directives</label>

            <p style={styles.formSubLabel}>Selected directives (# questions available)</p>
            {selectedDirectives}
          </div>

          <div className="clearfix" >
            <p style={styles.formSubLabel}>Select a module to find directives</p>
            <div className="" style={styles.selectFromLists}>
              <ol style={[styles.selectList, styles.modulesList]}>
                {_.map(props.moduleTree.children, (m, idx) => {
                  let selectedStyle = props.newMission.selectedModule === m ? styles.listItemSelected : null;
                  let unselectedStyle = props.newMission.selectedModule !== m ? styles.filterListItemUnselected : null;

                  return (
                    <li key={`selectModule_${idx}`} style={[styles.listItem, selectedStyle, unselectedStyle]}
                        onClick={(e) => props.updateMissionForm({selectedModule: m})}>{m.displayName}
                    </li>
                  )
                })}
              </ol>

              {selectDirectives}
            </div>
          </div>
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
