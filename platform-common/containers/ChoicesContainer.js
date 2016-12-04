import _ from 'lodash'
import { connect } from 'react-redux'

import { selectChoice } from 'platform-common/reducers/Mission/selectChoice'
import { setChoiceHeight } from 'platform-common/reducers/Mission/setChoiceHeight'

const mapStateToProps = (state, ownProps) => {
  return {
    choices: ownProps.question ? ownProps.question.choices : null,
    selectedChoiceId: state.mission.selectedChoiceId ? state.mission.selectedChoiceId : null,
    question: ownProps.question ? ownProps.question : null,
    heightByChoice: state.mission.heightByChoice ? state.mission.heightByChoice : {},
    responseId: ownProps.question && ownProps.question.responded ? ownProps.question.response.choiceIds[0] : null,
    isResponseCorrect: ownProps.question && ownProps.question.isCorrect ? ownProps.question.isCorrect : null
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSelectChoice: data => dispatch(selectChoice(data)),
    onSetChoiceHeight: data => dispatch(setChoiceHeight(data))
  }
}

const provider = (component) => {
  return connect(mapStateToProps, mapDispatchToProps)(component)
}

export default provider
