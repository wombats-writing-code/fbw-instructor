import React, {Component} from 'react';
import _ from 'lodash'
import pluralize from 'pluralize'
const ProgressBar = require('progressbar.js')

import EmptyState from 'fbw-platform-common/components/empty-state/web/EmptyState'
import OutcomesView from './OutcomesView'
import GradesTable from '../components/GradesTable'

import './MissionResult.scss'

const BAD_COLOR = "#FF6F69";
const MEDIUM_COLOR = "#fce77f";
const GOOD_COLOR = "#96CEB4";

class MissionResult extends Component {

  constructor() {
    super();
    this.state = {
      view: 'outcomes'
    }
  }

  componentDidMount() {
  }

  render() {
    let props = this.props;

    let view;
    if (this.state.view === 'outcomes') {
      view = <OutcomesView {...props} />
    } else {
      view = <GradesTable grades={props.grades}
                  mission={props.mission}
                  onSelectStudent={(student) => this.props.onSelectStudentResult(student, props.currentMission, props.user)}/>
    }


    return (
      <div className="mission-result">
        <div className="results__section">
          <div className="flex-container justify-center align-center">
            <p className={`results__subtitle ${this.state.view === 'outcomes' ? 'is-active' : null}`}
                onClick={() => this.setState({view: 'outcomes'})}
            >Outcomes</p>
            <p className={`results__subtitle ${this.state.view === 'grades' ? 'is-active' : null}`}
                onClick={() => this.setState({view: 'grades'})}
            >Grades</p>
          </div>
        </div>

        <div className="results__section">
          {view}
        </div>
      </div>

    )
  }
}

export default MissionResult
