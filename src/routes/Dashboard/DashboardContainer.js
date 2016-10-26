import { connect } from 'react-redux'
import Dashboard from './Dashboard'

import {changeView} from '../../reducers/view'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeView: (viewName) => dispatch(changeView({name: viewName})),
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    view: state.view,
    mission: state.mission ? state.mission.currentMission : null,
    results: state.mission ? state.mission.results : []
  }

}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
