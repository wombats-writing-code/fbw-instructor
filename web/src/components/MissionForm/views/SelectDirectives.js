
import React, {Component} from 'react'
import EmptyState from '../../EmptyState'
import './SelectDirectives.scss'
import {matches} from '../../../reducers/utilities'

class SelectDirectives extends Component {

  constructor() {
    super();
    this.state = {
      isExpanded: false
    }
  }

  render() {
    let props = this.props;
    let selectedModule = props.newMission.selectedModule;
    let selectedDirectives = props.newMission.selectedDirectives;
    let displayedDirectives = selectedModule ? selectedModule.children : props.outcomes;
    if (this.state.isExpanded) {
      displayedDirectives = _.filter(displayedDirectives, o => matches(o.displayName.text) );
    }

    console.log('moduletree', props.moduleTree, 'selectedModule', selectedModule)

    let selectedDirectivesList;
    if (props.newMission.selectedDirectives) {
      selectedDirectivesList = (<ol className="">
        {_.map(props.newMission.selectedDirectives, (item, idx) => {
          let outcome = item.outcome;
          return (
            <li key={`selectedDirective_${idx}`} className="">
              <span>{outcome.displayName.text} </span>&nbsp;
              (<span className="">{props.numberItemsForDirectives[outcome.id] || 0}</span>)
            </li>
          )
        })}
      </ol>)
    } else {

      selectedDirectivesList = EmptyState("No directives in this mission yet.")
    }

    let filterByModule;
    if (this.state.isExpanded) {
      filterByModule = (
        <div className="clearfix select-modules-section" >
          <p className="select-directives__section-title">Filter by module</p>
          <ol className="modules-list clearfix">
            {_.map(props.moduleTree.children, (m, idx) => {
              let isSelected = props.newMission.selectedModule === m;
              // let unselectedStyle = props.newMission.selectedModule !== m ? styles.filterListItemUnselected : null;

              return (
                <li key={`selectModule_${idx}`} className={isSelected ? "modules-list__item is-selected" : "modules-list__item"}
                    onClick={(e) => props.updateMissionForm({selectedModule: m})}>
                    {m.displayName}
                </li>
              )
            })}
          </ol>
        </div>
      )
    }

    return (
      <div className="select-directives">
        <div className="clearfix" >
          <label className="form-label">Directives</label>
          <p className="">Selected directives (# questions available)</p>
          {selectedDirectivesList}
        </div>

        {filterByModule}

        <div className="form-subsection">
          <p className="select-directives__section-title">Directives
            <span>{selectedModule ? 'in ' + selectedModule.displayName : null}</span>
          </p>

          <div className="directive-search">
            <input value={this.state.searchQuery} onChange={(e) => this.setState({searchQuery: e.target.value})}/>
          </div>

          <ul className="directives-list">
            {_.map(displayedDirectives, (outcome, idx) => {
              let isSelected = _.find(selectedDirectives, (item) => item.outcome === outcome);
              let selectDirectiveIcon = isSelected ?
                                        (<span key={`icon_${idx}`} className="select-directive-icon">&#x02296;</span>) :
                                        (<span key={`icon_${idx}`} className="select-directive-icon">&oplus;</span>);

              return (
                <li key={`selectOutcome_${idx}`} className="directives-list__item"
                    onClick={(e) => props.updateMissionForm({toggledDirective: {outcome, numberItems: props.numberItemsForDirectives[outcome.id]}})}>

                  {selectDirectiveIcon}
                  {outcome.displayName.text}
                </li>
              )
            })}
          </ul>
      </div>

      </div>
    )
  }
}

export default SelectDirectives
