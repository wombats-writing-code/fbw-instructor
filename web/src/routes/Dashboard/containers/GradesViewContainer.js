import { connect } from 'react-redux'

import GradesView from '../views/GradesView'
import {pointsSelector} from '../selectors/pointsSelector'


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    grades: pointsSelector(state, ownProps)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(GradesView)
