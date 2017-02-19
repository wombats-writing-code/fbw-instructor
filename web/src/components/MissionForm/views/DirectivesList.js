import React, {Component} from 'react'
import './DirectivesList.scss'

import {getOutcomeModule, isRootOutcome} from '../selectors/'

export default (props) => {
  if (!props.directives || props.directives.length === 0 || !props.mapping) return null;

  // console.log('props of DirectivesList', props);
//
  return (
    <ul className="directives-list">
      {_.map(props.directives, (outcome, idx) => {
        let isSelected = _.find(props.selectedDirectives || [], (item) => item === outcome);
        let selectDirectiveIcon = isSelected ?
                                  (<span key={`icon_${idx}`} className="select-directive-icon unselect">&#x02717;</span>) :
                                  (<span key={`icon_${idx}`} className="select-directive-icon select">&#x02713;</span>)

        let removeButton = isSelected ?
                            (<span className="add-remove-directive-button remove">Remove</span>) :
                            (<span className="add-remove-directive-button add">Add</span>);

        let module = getOutcomeModule(outcome, props.mapping.modules, props.mapping.relationships);

        let staggeredClass = isRootOutcome(outcome, props.mapping.outcomes, props.mapping.modules, props.mapping.relationships) ? 'target' : 'non-target';

        return (
          <li key={`selectOutcome_${idx}`}
              className={`flex-container align-center space-between directives-list__item ${staggeredClass}`}
              onClick={(e) => props.onClickDirective({toggledDirective: outcome})}>

            {/* {selectDirectiveIcon} */}
            <span className="outcome-text">{outcome.displayName}</span>

            <span className="directives-list__item__module-label truncate">{module ? module.displayName : null}</span>
            <span className="number-items-for-directives">
              ({props.numberItemsForDirectives[outcome.id] || 0} questions)
            </span>

            {removeButton}
          </li>
        )
      })}
    </ul>
  )
}
