import React, {Component} from 'react';
import _ from 'lodash'
import moment from 'moment'
import pluralize from 'pluralize'
const ProgressBar = require('progressbar.js')

import GradesTable from '../GradesTable'
import OutcomeResult from '../OutcomeResult'
import EditPhaseII from '../EditPhaseII'

import {missionConfig} from 'fbw-platform-common/reducers/Mission'
import {getD2LDisplayName, getD2LUserIdentifier} from 'fbw-platform-common/selectors/login'
import {computeRecommendation} from '../../../MissionEdit/selectors/recommendMissionSelector'


import './MissionResult.scss'

class MissionResult extends Component {

  constructor() {
    super();
    this.state = {
      view: 'grades'
    }
  }

  componentDidMount() {
  }

  render() {
    let props = this.props;

    let outcomesAction;
    if (props.result) {
      outcomesAction = (
        <div className="outcomes-action">
          <p className="outcomes-action__prompt">Review <b>{props.result.reviewOutcomes.length}</b> outcomes: </p>
          <ol>
            {_.map(props.result.reviewOutcomes, (responses, idx) => {
              let outcomeId = responses[0].outcome;
              let outcome = _.find(props.outcomes, {id: outcomeId});
              if (!outcome) return null;

              // console.log('outcome', outcome);

              return (
                <OutcomeResult key={`outcome-result_${idx}`}
                      recordsForOutcome={responses} outcome={outcome}
                      mission={props.currentMission}
                      onSelectStudentResponse={(student) => props.onSelectStudentResult(student, props.currentMission, props.user)}
                />
              )

            })}
          </ol>
        </div>
      )

    }

    let editPhaseII;
    if (props.isEditMissionInProgress) {
      editPhaseII = <EditPhaseII mission={props.currentEditMission}
                        outcomes={props.outcomes}
                        roster={props.roster}
                        isUpdateMissionInProgress={props.isUpdateMissionInProgress}
                        isDeleteMissionInProgress={props.isDeleteMissionInProgress}
                        onChangeMissionStart={props.onChangeMissionStart} onChangeMissionEnd={props.onChangeMissionEnd}
                        onClickCancel={props.onClickCancelEditMission}
                        onDelete={(mission) => props.onClickDeleteEditMission(mission, props.user)}
                        onSave={(mission) => props.onClickSaveEditMission(mission, props.user)}
                      />
    }

    return (
      <div className="mission-result clearfix">
        <div className="results__section clearfix">
            <GradesTable grades={props.grades}
                          mission={props.mission}
                          missions={props.missions}
                          missionType={props.missionType}
                          isCreateMissionInProgress={props.isCreateMissionInProgress}
                          onSelectStudent={(student) => this.props.onSelectStudentResult(student, props.currentMission, props.user)}
                          onClickCreateMission={(student) => this._onClickCreateMission(student)}
                          onClickEditMission={(mission) => this._onClickEditMission(mission)}
            />
        </div>

        <div className="results__section clearfix">
          {outcomesAction}
        </div>

        {editPhaseII}
      </div>

    )
  }

  // Launches a Phase II mission
  _onClickCreateMission(student) {
    let recommendation = computeRecommendation(student, this.props.records, this.props.currentMission);

    let newMission = _.assign({}, this.props.currentMission, {
      displayName: `${this.props.currentMission.displayName} Phase II`,
      description: `for ${getD2LDisplayName(student)}`,
      type: missionConfig.PHASE_II_MISSION_TYPE,
      startTime: new Date(),
      deadline: moment().add(3, 'days'),
      followsFromMissions: [this.props.currentMission.id],
      goals: recommendation.goals,
      userId: getD2LUserIdentifier(student),
      questions: null
    })

    console.log('newMission', newMission)
    // console.log('currentMission', this.props.currentMission)

    this.props.onCreateMissions([newMission], this.props.currentCourse, student);
  }

  _onClickEditMission(mission) {
    // console.log('_onClickEditMission', mission);

    this.props.onClickEditMission(mission);
  }
}



export default MissionResult
