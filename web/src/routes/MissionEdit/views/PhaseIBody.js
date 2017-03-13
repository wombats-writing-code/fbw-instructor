import React, {Component} from 'react'
import {getD2LDisplayName, getD2LUserIdentifier} from 'fbw-platform-common/selectors/login'

import SelectDirectives from './SelectDirectives';

class PhaseIBody extends Component {

  render() {
    let props = this.props;

    return (
      <div className="phase-I-form">
        <div className="form-section">
          <div className="columns">
            <input type="text" className="mission-form__input"
                   value={props.newMission.displayName}
                   placeholder="My new mission name"
                   id="displayName"
                   onChange={(e) => props.onChangeMissionName(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="form-label">Goals</label>
          <SelectDirectives selectedOutcomeIds={props.newMission.goals}
                            selectedModule={props.selectedModule}
                            displayedDirectives={props.displayedDirectives}
                            itemsForDirectives={props.itemsForDirectives}
                            mapping={props.mapping}
                            outcomeQuery={props.outcomeQuery}
                            onSelectModule={props.onSelectModule}
                            onChangeOutcomeSearch={props.onChangeOutcomeSearch}
                            onToggleOutcome={props.onToggleOutcome}/>
        </div>


      </div>
    )
  }

}

export default PhaseIBody
