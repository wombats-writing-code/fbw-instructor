import React, {Component} from 'react';
import 'lodash'
import {Link} from 'react-router'

import BASE_STYLES from '../../../styles/baseStyles'
import EmptyState from '../../../components/EmptyState'
import LoadingBox from '../../../components/LoadingBox'
import { DateRangePicker } from 'react-dates'
import 'react-dates/css/variables.scss'
import 'react-dates/css/styles.scss'

import {extractDisplayName} from 'fbw-platform-common/d2lutils'

// require('./datepicker.css')
import './RecommendMission.scss'

const _getPlurality = (number) => {
  if (number === 1) return '';

  return 's';
}

export default function(props) {
  // console.log('props of recommend mission', props);
  if (!props.recommendation) {
    return null;
  }

  let spawnStatus, spawnVerb;
  if (props.mission.hasSpawnedFollowOnPhase || props.spawnedMissions) {
    spawnStatus = (
      <p >
        Testflight missions have been created. Every student has received a personalized mission targeting the directives they missed:
      </p>
    )
    spawnVerb = 'received';

  } else if (!props.isSpawnInProgress && !props.spawnedMissions) {
    spawnStatus = <p>
      Your Fly-by-Wire system recommends to give personalized Testflight missions:
    </p>
    spawnVerb = 'will get';
  }

  let studentCollection;

  studentCollection = (
    <ul className="student-recommendation-list">
      {_.map(props.recommendation.students, (student, idx) => {
        return (
          <li key={`student_${idx}`}>
            <p>
              <Link key={`studentName__${idx}`} className="link">{extractDisplayName(student.name)}</Link>
              <span> {spawnVerb} </span>
              <span>{student.nextMission.directives.length} </span>
              <span>directive{_getPlurality(student.nextMission.directives.length)} with a total of </span>
              <span>{student.nextMission.numberItemsForDirectives} </span>
              question{_getPlurality(student.nextMission.numberItemsForDirectives)}.</p>
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className="">
      <div className="form-section clearfix">
         <label className="form-label">Dates</label>
         {/* <DateRangePicker className=""
                         onDateChange={(date) => props.updateSpawnDate({date: date})}
                          onFocusChange={props.updateSpawnDate}
                          focusedInput={props.spawnMission.spawnDate}
                          startDate={props.spawnMission.startTime}
                          endDate={props.spawnMission.deadline} /> */}
       </div>

      {studentCollection}

      {/* {spawnStatus}
      {spawnDate}
      {spawnButton}
      {loadingBox} */}
    </div>

  )

}
