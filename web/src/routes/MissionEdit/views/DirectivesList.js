import React, {Component} from 'react'
import pluralize from 'pluralize'

import QuestionCard from 'fbw-platform-common/components/question-card/web/QuestionCard'
import './DirectivesList.scss'

import {getOutcomeModule, isRootOutcome} from '../selectors/'


class DirectivesList extends Component {

  constructor() {
    super();
    this.state = {
      isOutcomeQuestionsExpanded: {}
    }
  }

  render() {
    let props = this.props;
    if (!props.directives || props.directives.length === 0 || !props.mapping) return null;

    // console.log('props of DirectivesList', props);

    return (
      <ol className="directives-list" style={{...props.styles}}>
        {_.map(props.directives, (outcome, idx) => {
          let itemsForDirective = props.itemsForDirectives[outcome.id] || [];

          if (itemsForDirective.length === 0) return null;


          let isSelected = _.find(props.selectedOutcomeIds || [], (id) => id === outcome.id);
          let selectDirectiveIcon = isSelected ?
                                    (<span key={`icon_${idx}`} className="select-directive-icon unselect">&#x02717;</span>) :
                                    (<span key={`icon_${idx}`} className="select-directive-icon select">&#x02713;</span>)

          let removeButton;
          if (isSelected) {
            removeButton = (
              <span className="add-remove-directive-button remove"
                          onClick={(e) => {e.stopPropagation(); props.onToggleOutcome(outcome)}}>
              Remove</span>
            )

          } else {
            removeButton = (
              <span className="add-remove-directive-button add"
                      onClick={(e) => {e.stopPropagation(); props.onToggleOutcome(outcome)}}>
              Add</span>);

          }

          let module = props.showModuleLabel && getOutcomeModule(outcome, props.mapping.modules, props.mapping.relationships);
          let moduleLabel;
          if (module) {
            moduleLabel = (
              <span className="directives-list__item__module-label truncate">{module ? module.displayName : null}</span>
            )
          }
          // console.log(props.itemsForDirectives, itemsForDirective)
          let previewItem;
          if (this.state.isOutcomeQuestionsExpanded[outcome.id]) {
            previewItem = (
              <div className="preview-question-card">
                <QuestionCard question={itemsForDirective[0]} outcome={outcome}
                              isExpanded={true} isExpandable={false}
                              isSubmitEnabled={false}/>
              </div>
            )
          }

          let targetIcon;
          let staggeredClass = isRootOutcome(outcome, props.mapping.outcomes, props.mapping.modules, props.mapping.relationships) ? 'target' : 'non-target';
          if (staggeredClass === 'target') {
            targetIcon = (
              <img className="directives-list__target-icon" src={require('../assets/target.png')} />
            )
          }

          return (
            <li key={`selectOutcome_${idx}`}>
              <div className={`directives-list__item ${staggeredClass} flex-container align-center space-between`} >
                {targetIcon}
                <span className="outcome-text">{outcome.displayName}</span>
                {moduleLabel}

                <img className="visualize-icon" src={require('../assets/tree.png')}
                      onClick={(e) => {e.stopPropagation(); e.preventDefault(); props.onVisualizeEntity(outcome)}}
                />

                <span className="button preview-questions-button"
                        onClick={(e) => {e.stopPropagation(); this._toggleOutcomeQuestions(outcome)}}>

                  {this.state.isOutcomeQuestionsExpanded[outcome.id] ? 'Hide ' : 'Preview '}
                  {itemsForDirective.length} {pluralize('question', itemsForDirective.length)}
                </span>

                {removeButton}
              </div>

              {previewItem}

            </li>
          )
        })}
      </ol>
    )
  }

  _toggleOutcomeQuestions = (outcome) => {
    this.setState({
      isOutcomeQuestionsExpanded: _.assign({}, this.state.isOutcomeQuestionsExpanded, {
        [outcome.id]: !this.state.isOutcomeQuestionsExpanded[outcome.id]
      })
    })

    // console.log('state for ', outcome.id, this.state.isOutcomeQuestionsExpanded[outcome.id])
  }
}

export default DirectivesList
