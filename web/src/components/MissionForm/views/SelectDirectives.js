
import React, {Component} from 'react'
import EmptyState from '../../EmptyState'
import './SelectDirectives.scss'

import DirectivesList from './DirectivesList'

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

    // console.log('displayedDirectives', props.displayedDirectives)
    // console.log('selectedDirectives',selectedDirectives)\
    // console.log('selectedModule', selectedModule)
    // console.log('moduletree', props.moduleTree, 'selectedModule', selectedModule)

    let filterByModule, filterByModuleText;
    if (this.state.isExpanded) {
      filterByModule = (
        <div className="clearfix select-modules-section" >
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

      filterByModuleText = <span className="app-blue-dark">Hide modules</span>;
    } else {
      filterByModuleText = <span className="app-blue-dark">Filter by modules (Show)</span>;
    }

    return (
      <div className="select-directives">
        <div className="clearfix" >
          <p className="select-directives__section-title">Selected directives (# questions available)</p>
          <DirectivesList directives={selectedDirectives} selectedDirectives={selectedDirectives}
                        moduleTree={props.moduleTree} numberItemsForDirectives={props.numberItemsForDirectives}
                        onClickDirective={props.updateMissionForm} />
        </div>

        <div className="form-subsection">
          <p className="select-directives__section-title">Select directives</p>

          <div className="directive-search">
            <input className="directive-search-input"
                    placeholder="Search by directive name"
                    value={props.newMission.directiveSearchQuery}
                    onChange={(e) => props.updateMissionForm({directiveSearchQuery: e.target.value})}/>
          </div>

          <p className="select-directives__section-title filter-by-module-text" onClick={() => this.setState({isExpanded: !this.state.isExpanded})}>
            {filterByModuleText}
          </p>

          {filterByModule}

          <DirectivesList directives={props.displayedDirectives} selectedDirectives={selectedDirectives}
                          moduleTree={props.moduleTree} numberItemsForDirectives={props.numberItemsForDirectives}
                          onClickDirective={props.updateMissionForm} />
      </div>

      </div>
    )
  }
}

export default SelectDirectives
