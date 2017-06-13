import React, {Component} from 'react';
import _ from 'lodash'
import pluralize from 'pluralize'
const ProgressBar = require('progressbar.js')

import GradesTable from '../GradesTable'
import OutcomeResult from '../OutcomeResult'

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

    return (
      <div className="mission-result clearfix">
        <div className="results__section">
            <GradesTable grades={props.grades}
                          mission={props.mission}
                          onSelectStudent={(student) => this.props.onSelectStudentResult(student, props.currentMission, props.user)}/>
        </div>

        <div className="results__section clearfix">
          {outcomesAction}
        </div>
      </div>

    )
  }
}

export default MissionResult
