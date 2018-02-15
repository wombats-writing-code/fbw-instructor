import _ from 'lodash'
import React, { Component } from 'react'
import moment from 'moment'
import $ from 'jquery'

// import { CSVLink } from 'react-csv'

import { missionConfig } from '@wombats-writing-code/fbw-platform-common/reducers/Mission'
import LoadingBox from '@wombats-writing-code/fbw-platform-common/components/loading-box/web/'
import { parseResults,
  computeGrades, parseGradeForCSV } from './selectors/resultsSelector'
import {
  getD2LDisplayName, getD2LUserIdentifier,
  getD2LDisplayNameLastFirst
} from '@wombats-writing-code/fbw-platform-common/selectors/login'
import { computeRecommendation } from '../MissionEdit/selectors/recommendMissionSelector'

import EditPhaseIIDates from './components/EditPhaseIIDates'
import MissionResult from './components/MissionResult'
import DownloadLink from './components/DownloadLink'

import './Dashboard.scss'

class Dashboard extends Component {

  constructor() {
    super();

    this.state = {
      phaseIIPositionStyle: null
    }
  }

  componentDidMount() {
    // make sure the dashboard shows Phase I missions only
    this.props.onResetDashboardMission(this.props.mission)

    // let timelineHeight =
    setTimeout(() => {
      let phase2Results = $('#phase2Results').position()
      if (phase2Results) {
        this.setState({
          phaseIIPositionStyle: {
            transform: `translateY(${phase2Results.top}px)`
          }
        })
      }

      // console.log('phaseIIPositionStyle', phase2Results.top);
    }, 300)

    if (!this.props.resultsByMission) {
      this.props.onClickRefreshResults(this.props.mission, this.props.user)
    }
  }

  render() {
    let props = this.props

    let loadingBox
    if (this.props.isGetResultsInProgress) {
      loadingBox = LoadingBox('enter-active')
    } else {
      loadingBox = LoadingBox('enter')
    }

    if (!props.resultsByMission) {
      return (<div className="row">
        {loadingBox}
      </div>)
    };

    let phaseIResults;
    if (props.mission && !this.props.isGetResultsInProgress && !this.props.isGetMissionsInProgress) {
      phaseIResults = (
        <div>
          <p className="dashboard__timeline-point__text">
            <b>Phase I</b> &thinsp;
            {moment(props.mission.startTime).format('h:mm a ddd M/D')}
            &mdash;
            {moment(props.mission.deadline).format('h:mm a ddd M/D')}
          </p>
          <MissionResult
            result={this._getResults(props.mission, missionConfig.PHASE_I_MISSION_TYPE)}
            records={this._getRecords(props.mission, missionConfig.PHASE_I_MISSION_TYPE)}
            mission={props.mission}
            isGetResultsInProgress={props.isGetResultsInProgress}
            onCreateMissions={this._onCreateMissionsForStudents}
          />
        </div>
      )
    }

    let phase2Missions = _.map(props.mission.leadsToMissions, id => _.find(props.missions, {id: id}));
    // console.log('phaseIIMissions', phase2Missions)

    let launchMissionButtonText;
    if (this.props.isCreateMissionInProgress) {
      launchMissionButtonText = 'Working...'
    } else if (phase2Missions && phase2Missions.length > 0) {
      launchMissionButtonText = 'Phase II launched'
    } else if ((!phase2Missions || phase2Missions.length === 0)) {
      launchMissionButtonText = 'Launch all Phase II\'s'
    }

    let phase2Results
    if (phase2Missions && phase2Missions.length > 0) {
      phase2Results = (
        <div>
          <p className="dashboard__timeline-point__text phase-ii-dashboard">
            <span className="phase-ii-label"><b>Phase II</b> &thinsp;</span>
            <button
              className="button dashboard__launch-mission-edit-phase-ii-button"
              onClick={() => this.props.onClickEditMissionDates(props.mission)}>
                Edit All Phase IIs
            </button>
          </p>
          <MissionResult
            result={this._getResults(props.mission, missionConfig.PHASE_II_MISSION_TYPE)}
            records={this._getRecords(props.mission, missionConfig.PHASE_II_MISSION_TYPE)}
            mission={this.props.mission}
            missionType={missionConfig.PHASE_II_MISSION_TYPE}
            isGetResultsInProgress={props.isGetResultsInProgress}
            isEditMissionDatesInProgress={props.isEditMissionDatesInProgress}
          />
        </div>
      )
    } else if (!this.props.isGetMissionsInProgress) {
      phase2Results = (
        <div className="flex-container align-center space-between">
          <p className="dashboard__timeline-point__text">
            <b>Phase II</b> &thinsp;
            No Phase II missions have been launched from this one.
          </p>
        </div>

      )
    }

    let launchAllPhaseIIButton = (
      <button
        className="button dashboard__launch-mission-bulk-button-disabled"
        disabled>
          {launchMissionButtonText}
      </button>
    );

    // If the deadline is passed and there are no existing Phase II
    //   missions, show a button for launching them.
    if (this._canLaunchPhaseIIBulk()) {
      launchAllPhaseIIButton = (
        <button
          className="button dashboard__launch-mission-bulk-button"
          onClick={() => this._onCreateMissions()}>
            {launchMissionButtonText}
        </button>
      )
    }

    // if want to bulk-edit the phase II dates, then show the modal
    let editPhaseIIDates
    if (props.isEditMissionDatesInProgress) {
      editPhaseIIDates = <EditPhaseIIDates
        mission={props.currentEditMission}
        missions={props.missions}
        onChangeMissionStart={props.onChangeMissionStart}
        onChangeMissionEnd={props.onChangeMissionEnd}
        onClickCancel={props.onClickCancelEditMissionDates}
        onSave={(missions) => props.onClickSaveEditMissions(missions, props.user)}
      />
    }

    const filename = this.props.mission
      ? `${this.props.mission.displayName}-grades.csv`
      : `mission-grades-${moment.toISOString()}.csv`

    return (
      <div className="">
        {editPhaseIIDates}
        <div className="row dashboard__title">
          <div className="columns flex-container space-between align-center">
            <p className="dashboard__mission-name">
              {this.props.mission ? this.props.mission.displayName : ''} &nbsp;
            </p>
            <DownloadLink
              data={this._formatResultsForDownload()}
              mimetype="text/csv;encoding:utf-8"
              className="download-csv-link"
              filename={filename}
            >Download CSV</DownloadLink>
            {launchAllPhaseIIButton}
            <button className="button refresh-button"
                    disabled={this.props.isGetResultsInProgress}
                    onClick={() => this.props.onClickRefreshResults(props.mission, props.user)}>
              {this.props.isGetResultsInProgress ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <hr />
        </div>

        <div className="row ">
          <div className="mission-result-container">
            {phaseIResults}
          </div>

          <div className="mission-result-container" id="phase2Results">
            {phase2Results}
          </div>
        </div>

        <div className="row">
          {loadingBox}
        </div>
      </div>
    )
  }

  _alphabetizeRows = (results) => {
    // Alphabatize all the results by the value in column 0.
    // Keep the first element from ``results``(the headers).
    const newResults = [_.assign([], results[0])]
    results.splice(0, 1)
    return _.concat(newResults, _.orderBy(results, result => result[0]))
  }

  _calculateNumGoalsMastered = (results) => {
    // Calculate the total number of goals mastered in Phase 1 and 2.
    // Will have to account for the following edge cases:
    //   * Only did phase 1, so the record entry will not have enough filler
    //     columns.
    //   * Only did phase 2, so nothing to sum from phase 1
    const newResults = [_.assign([], results[0])]
    results.splice(0, 1)
    return _.concat(newResults, _.map(results, (result) => {
      if (result.length === 6) {
        // Did Phase 1 only, no Phase 2 data
        return _.concat(result, [
          '',
          '',
          '',
          '',
          '', // divider
          result[3],
          result[4]
        ])
      } else if (result[3] === '') {
        // Did Phase 2 only, no Phase 1 data
        return _.concat(result, [result[8], result[9]])
      }
      // Has both phase 1 and phase 2 data
      return _.concat(result,
        ['' + (parseInt(result[3]) + parseInt(result[8])),
          result[4]])
      // Impossible to have no Phase 1 or Phase 2 data at this point
    }))
  }

  _updateResults = (label, currentResults, grades) => {
    const newResults = _.assign([], currentResults)
    const existingUsers = _.map(newResults, result => result[0])
    // If this is a set of Phase 1 results, then we just populate
    //   rows into newResults.
    // If this is a set of Phase 2 results, we need to look for
    //   an existing match on the grade.user. If a match exists,
    //   append the data. If no match, create a new row with filler
    //   blanks for Phase 1 data.
    _.each(grades, grade => {
      const csvGrade = parseGradeForCSV(grade)
      const username = getD2LDisplayNameLastFirst(grade.user)
      if (label === 'Phase I') {
        newResults.push([
          username,
          // Phase 1 results
          csvGrade.questionsCorrect,
          csvGrade.totalQuestions,
          csvGrade.goalsMastered,
          csvGrade.totalGoals,
          ''
        ])
      } else {
        const userIndex = existingUsers.indexOf(username)
        if (userIndex > -1) {
          newResults[userIndex] = _.concat(newResults[userIndex], [
            csvGrade.questionsCorrect,
            csvGrade.totalQuestions,
            csvGrade.goalsMastered,
            csvGrade.totalGoals,
            '' // divider
          ])
        } else {
          newResults.push([
            username,
            // Phase 1 results
            '',
            '',
            '',
            '',
            '', // divider
            // Phase 2 results
            csvGrade.questionsCorrect,
            csvGrade.totalQuestions,
            csvGrade.goalsMastered,
            csvGrade.totalGoals,
            '' // divider
          ])
        }
      }
    })
    return newResults
  }

  _formatResultsForDownload = () => {
    if (!this.props.roster) {
      return []
    }

    let results = []

    // The headers we'll use let us keep one row per student, and
    //   so we have separate columns for Phase 1 results versus Phase 2 results.
    // Note that the "Total Goals Mastered" is just a sum of the
    //   Phase 1 and Phase 2 Goals Mastered.
    let headers = ['Last Name, First Name',
      'Ph 1 Questions Correct', 'Ph 1 Total Questions', 'Ph 1 Goals Mastered',
      'Ph 1 Total Goals', '',
      'Ph 2 Questions Correct', 'Ph 2 Total Questions', 'Ph 2 Goals Mastered',
      'Ph 2 Total Goals', '', 'Total Goals Mastered', 'Total Goals', '', 'Notes']

    results.push(headers)

    // Then do phase 1 grades
    const phaseIGrades = _.filter(computeGrades(this.props.mission,
      this._getRecords(this.props.mission, missionConfig.PHASE_I_MISSION_TYPE),
      this.props.roster), grade => grade.points)
    results = this._updateResults('Phase I', results, phaseIGrades)

    // Next do phase 2 grades, matching on student ID
    // Make sure to add a new row if the student missed phase 1
    const phaseIIGrades = _.filter(computeGrades(this.props.mission,
      this._getRecords(this.props.mission, missionConfig.PHASE_II_MISSION_TYPE),
      this.props.roster), grade => grade.points);
    results = this._updateResults('Phase II', results, phaseIIGrades)

    // Alphabetize by last name
    results = this._alphabetizeRows(results)

    // Add in the summary column for number of goals mastered
    results = this._calculateNumGoalsMastered(results)

    // Now format it into a CSV string
    results = _.map(results, row => {
      return _.map(row, element => {
        return `"${element}"`
      }).join(',')
    }).join('\n')
    return results
  }

  _canLaunchPhaseIIBulk() {
    const records = this._getRecords(this.props.mission, missionConfig.PHASE_I_MISSION_TYPE)
    if (this.props.mission.type === missionConfig.PHASE_I_MISSION_TYPE &&
        this.props.mission.leadsToMissions.length === 0 &&
        this.props.mission.leadsToMissionsDeadline &&
        this.props.mission.leadsToMissionsStartTime &&
        records &&
        records.length > 0) {
      return true
    }
    return false
  }

  _onCreateMissions() {
    // This gets a list of the students who took phase 1
    //   and then calls the helper method
    //   ````this._onCreateMissionsForStudents````
    //   and passes it the list of students.
    const records = this._getRecords(this.props.mission, missionConfig.PHASE_I_MISSION_TYPE)
    const students = _.uniqBy(_.map(records, 'user'), 'Identifier');
    this._onCreateMissionsForStudents(students);
  }

  _onCreateMissionsForStudents = (students) => {
    // This computes the recommendation for each student,
    //   and then calls the reducers.
    if (!this.props.mission.leadsToMissionsDeadline) {
      throw Error('Somehow you clicked Launch All Phase II\'s but there is no deadline set.')
    }
    if (!this.props.mission.leadsToMissionsStartTime) {
      throw Error('Somehow you clicked Launch All Phase II\'s but there is no start time set.')
    }

    let newMissions = _.map(students, (student) => {
      const records = this._getRecords(this.props.mission, missionConfig.PHASE_I_MISSION_TYPE)
      // console.log('records', records)
      let recommendation = computeRecommendation(student, records, this.props.mission);
      // console.log('recommendation', recommendation)
      let newMission = _.assign({}, {
        displayName: `${this.props.mission.displayName} Phase II`,
        description: `for ${getD2LDisplayName(student)}`,
        type: missionConfig.PHASE_II_MISSION_TYPE,
        startTime: this.props.mission.leadsToMissionsStartTime,
        deadline: this.props.mission.leadsToMissionsDeadline,  // make this a moment obj?
        followsFromMissions: [this.props.mission.id],
        goals: recommendation.goals,
        userId: getD2LUserIdentifier(student),
        questions: null
      })

      console.log('newMission', newMission)
      return newMission
    })

    this.props.onCreateMissions(newMissions, this.props.currentCourse, this.props.user);
  }

  _getLeadsToMission(mission) {
    let leadsToMission = _.find(this.props.missions, {id: mission.leadsToMissions[0]});
    if (mission.leadsToMissions.length > 0 && !leadsToMission) {
      throw new Error('Current mission has leadsToMissions but not found in list of missions. Check DB.')
    }

    return leadsToMission
  }

  _getRecords(mission, getForMissionType) {
    let records;
    if (getForMissionType === missionConfig.PHASE_I_MISSION_TYPE) {
      records = this.props.resultsByMission[mission.id];

      // console.log('records for phase 1', mission.displayName, records)
    } else if (getForMissionType === missionConfig.PHASE_II_MISSION_TYPE) {
      // console.log('leadsToMissions', mission.leadsToMissions)

      records = _.compact(_.flatten(_.map(mission.leadsToMissions, id => this.props.resultsByMission[id])));

      // console.log(records.length, 'records')
      // console.log('records', records)

    } else {
      throw new Error('You must specify for Phase I or Phase II you want to get records')
    }

    return records;
  }

  _getResults(mission, getForMissionType) {
    let records = this._getRecords(mission, getForMissionType);
    let results = parseResults(records, this.props.roster, mission);

    return results;
  }

}

export default Dashboard
