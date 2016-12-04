
import { connect } from 'react-redux'

import ResultsView from '../views/ResultsView'
import {resultsSelector} from '../selectors/resultsSelector'
import {selectDirective} from '../../../reducers/view'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickDirective: (directive, viewName) => dispatch(selectDirective(directive, viewName))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    viewData: resultsSelector(state),
    view: state.view,
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ResultsView)
