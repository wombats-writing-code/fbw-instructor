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

    let selectedDirectivesLabel = props.selectedOutcomeIds ?
                                  (<p className="select-directives__section-title">Selected goals (# questions available)</p>)
                                  : null;

    // let filterByModule, filterByModuleText;
    // if (this.state.isExpanded) {
    //   filterByModule = (
    //     <div className="clearfix select-modules-section" >
    //       <ol className="modules-list clearfix">
    //         {_.map(props.mapping.modules, (m, idx) => {
    //           let isSelected = props.selectedModule === m;
    //
    //           return (
    //             <li key={`selectModule_${idx}`}
    //                 className={isSelected ? "modules-list__item is-selected" : "modules-list__item"}
    //                 onClick={(e) => props.onSelectModule(m)}>
    //                 {m.displayName}
    //
    //             </li>
    //           )
    //         })}
    //       </ol>
    //     </div>
    //   )
    //
    //   filterByModuleText = <span className="app-blue-dark">Hide modules</span>;
    // } else {
    //   filterByModuleText = <span className="app-blue-dark">Filter by modules (Show)</span>;
    // }

    return (
      <div className="select-directives">
        {selectedDirectivesLabel}
        <DirectivesList directives={_.map(props.selectedOutcomeIds, id => _.find(props.mapping.outcomes, {id: id}))}
                      selectedOutcomeIds={props.selectedOutcomeIds}
                      mapping={props.mapping} itemsForDirectives={props.itemsForDirectives}
                      onToggleOutcome={props.onToggleOutcome}  />

          <div className="form-subsection">
              <input className="directive-search-input"
                      placeholder="Search by directive name, e.g. graph exponential"
                      value={props.outcomeQuery}
                      onChange={(e) => props.onChangeOutcomeSearch(e.target.value)}/>

              <Select placeholder="...or search by module" className="select-module"
                  value={props.selectedModule}
                  name="displayName"
                  options={props.mapping.modules}
                  matchProp="id"
                  labelKey="displayName"
                  valueKey="id"
                  onChange={(value) => props.onSelectModule(value)}
              />
          </div>

          <DirectivesList directives={props.displayedDirectives} selectedOutcomeIds={props.selectedOutcomeIds}
                          mapping={props.mapping} itemsForDirectives={props.itemsForDirectives}
                          onToggleOutcome={props.onToggleOutcome} styles={{listStyle: 'none'}} />
      </div>
    )
  }
}

export default SelectDirectives
