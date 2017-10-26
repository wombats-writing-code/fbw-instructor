import _ from 'lodash'

import React, {Component} from 'react'

import {getD2LDisplayName, getD2LUserIdentifier} from 'fbw-platform-common/selectors/login'
import VisualizeEntity from './VisualizeEntity'
import SelectDirectives from './SelectDirectives';

class PhaseIBody extends Component {

  render() {
    let props = this.props;

    let visualizeEntity;
    if (props.currentEntity) {
      visualizeEntity = (
        <VisualizeEntity currentEntity={props.currentEntity}
                        relationships={props.mapping.relationships}
                        visualizedEntities={props.visualizedEntities}
                        onClickCancel={props.onCloseVisualizeEntity}
        />)
    }

    console.log("in phase i body");
    console.log('relationship', _.find(props.mapping.relationships, {id: "5932ad98fdbf1f790fabc29a"}));

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
                            onToggleOutcome={props.onToggleOutcome}
                            onMoveOutcomeUp={props.onMoveOutcomeUp}
                            onMoveOutcomeDown={props.onMoveOutcomeDown}
                            onVisualizeEntity={props.onVisualizeEntity}
                          />
        </div>

        {visualizeEntity}
      </div>
    )
  }

}

export default PhaseIBody
