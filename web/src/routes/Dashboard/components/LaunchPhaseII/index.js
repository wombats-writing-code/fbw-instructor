import React, {Component} from 'react';
import {browserHistory} from 'react-router'
import slug from 'slug'
import _ from 'lodash'


import './LaunchPhaseII.scss'

class LaunchPhaseII extends Component {

  render() {
    let props = this.props;

    let _isCreateMissionInProgress = props.isCreateMissionInProgress && props.isCreateMissionInProgress.userId === props.student.Identifier;

    let buttonText;
    if (_isCreateMissionInProgress) {
      buttonText = 'Working...';

    } else if (props.phaseIIDoesExist) {
      buttonText = 'Launched'

    } else {
      buttonText = 'Launch'
    }

    return (
      <div className="grades-table__phase-2-row">
        <button className="grades-table__launch-mission-button"
                disabled={_isCreateMissionInProgress || props.phaseIIDoesExist}
                onClick={() => this.props.onClick(props.student)}>
          {buttonText}
        </button>
      </div>
    )
  }
}

export default LaunchPhaseII
