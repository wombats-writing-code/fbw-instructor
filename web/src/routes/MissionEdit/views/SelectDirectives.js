import React, {Component} from 'react'
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import DirectivesList from './DirectivesList'
import './SelectDirectives.scss'

class SelectDirectives extends Component {

  constructor() {
    super();
    this.state = {
      isExpanded: true
    }
  }

  render() {
    let props = this.props;
    // console.log('props of SelectDirectives', props);

    let selectedDirectivesLabel = props.selectedOutcomeIds && props.selectedOutcomeIds.length > 0 ?
                                  (<p className="select-directives__section-title">Selected goals (# questions available)</p>)
                                  : null;

    return (
      <div className="select-directives">
        {selectedDirectivesLabel}

        <div className="row">
          <div className="medium-10 large-10 medium-push-1 columns">
            <DirectivesList
              directives={_.map(props.selectedOutcomeIds, id => _.find(props.mapping.outcomes, {id: id}))}
              selectedOutcomeIds={props.selectedOutcomeIds}
              mapping={props.mapping} itemsForDirectives={props.itemsForDirectives}
              onToggleOutcome={props.onToggleOutcome}
              onMoveOutcomeUp={props.onMoveOutcomeUp}
              onMoveOutcomeDown={props.onMoveOutcomeDown}
              onVisualizeEntity={props.onVisualizeEntity}
              selectedOutcomesList
            />
          </div>
        </div>


        {/* <div className="form-subsection">
            <input className="directive-search-input"
                    placeholder="Search by directive name, e.g. graph exponential"
                    value={props.outcomeQuery}
                    onChange={(e) => props.onChangeOutcomeSearch(e.target.value)}/>
        </div> */}

        <div className="row">
          <div className="medium-5 columns no-right-padding">
            <div className="select-modules-section">
              <p className="select-entity-section__title">Modules</p>
              <div className="select-modules__list">
                {_.map(props.mapping.modules, module => {
                  let isSelectedClass = props.selectedModule === module ? 'is-selected' : null;

                  return (
                    <div key={`${module.id}`} className={`modules-list__item flex-container space-between align-center ${isSelectedClass}`}
                        onClick={() => props.onSelectModule(module)}
                    >
                      <p className="no-margin-bottom">{module.displayName}</p>
                      <img className="visualize-icon" src={require('../assets/tree.png')}
                            onClick={(e) => {e.stopPropagation(); e.preventDefault(); props.onVisualizeEntity(module)}}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="medium-7 columns no-left-padding">
            <div className="select-outcomes-section">
              <p className="select-entity-section__title">Outcomes</p>
              <DirectivesList directives={props.displayedDirectives} selectedOutcomeIds={props.selectedOutcomeIds}
                              mapping={props.mapping} itemsForDirectives={props.itemsForDirectives}
                              showModuleLabel={false}
                              onToggleOutcome={props.onToggleOutcome} styles={{listStyle: 'none'}}
                              onVisualizeEntity={props.onVisualizeEntity}/>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default SelectDirectives
