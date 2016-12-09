import React, {Component} from 'react'
import './DirectivesList.scss'


export default (props) => {
  if (!props.directives || props.directives.length === 0) return null;

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

        let module = _.find(props.moduleTree.children, m => m.children.indexOf(outcome) > -1);

        return (
          <li key={`selectOutcome_${idx}`} className="flex-container align-center space-between directives-list__item"
              onClick={(e) => props.onClickDirective({toggledDirective: outcome})}>

            {/* {selectDirectiveIcon} */}
            <span className="outcome-text">{outcome.displayName.text}</span>

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
