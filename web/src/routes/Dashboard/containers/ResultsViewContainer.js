
import { connect } from 'react-redux'

import ResultsView from '../views/ResultsView'
import {makeResultsSelector} from '../selectors/resultsSelector'
import {selectDirective} from '../../../reducers/view'


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickDirective: (directive, viewName) => dispatch(selectDirective(directive, viewName))
  }
}

// https://github.com/reactjs/reselect#accessing-react-props-in-selectors
const makeMapStateToProps = () => {
  const getResultsSelector = makeResultsSelector()
  const mapStateToProps = (state, ownProps) => {
    return {
      view: state.view,
      viewData: getResultsSelector(state, ownProps),
    }
  }
  return mapStateToProps
}

export default connect(makeMapStateToProps, mapDispatchToProps)(ResultsView)
