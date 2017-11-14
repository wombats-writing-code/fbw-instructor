import _ from 'lodash'
import React, {Component} from 'react'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {getD2LDisplayName, getD2LUserIdentifier} from '@wombats-writing-code/fbw-platform-common/selectors/login'

import SelectDirectives from './SelectDirectives';

class PhaseIIBody extends Component {


  render() {
    let props = this.props;

    let goalsForMission; let composeFromMissions;
    if (props.newMission.type !== 'edit-mission') {
      goalsForMission = (
        <div>
          <label className="form-label">Recommendations for students</label>
          <ol>
            {_.map(props.recommendations, (rec, idx) => {
              return (
                <li key={`rec-${idx}`} className="recommendation">
                  <p>
                    <span>{getD2LDisplayName(rec.student)}</span>
                    <span> will get {rec.goals.length} directives (~{rec.goals.length*3} questions)</span>
                  </p>
                </li>
              )
            })}
          </ol>
        </div>
        )

        composeFromMissions = (
          <div className="form-section compose-missions">
            <p className="small">
              Phase II missions pick goals that students missed in previous missions.
              Pick one or more of these previous missions:
            </p>
            <Select
                value={props.newMission.followsFromMissions}
                name="displayName"
                options={props.missions}
                multi={true}
                matchProp="displayName"
                labelKey="displayName"
                valueKey="id"
                onChange={(value) => props.onSelectFollowFromMissions(value, props.user)}
            />
          </div>
        )
    }

    return (
      <div className="phase-II-form">
        {composeFromMissions}
        {goalsForMission}
      </div>
    )
  }

}

export default PhaseIIBody
