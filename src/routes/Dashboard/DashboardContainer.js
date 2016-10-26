import { connect } from 'react-redux'
import Dashboard from './Dashboard'

import {getMissions, receiveMissions} from '../../reducers/Mission/getMissions'
import {selectMission} from '../../reducers/Mission/selectMission'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getResults: () => _.noop()      // TODO once i think through state tree
    // onClickMission: (mission) => dispatch(selectMission(mission))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentMission: state.mission ? state.mission.currentMission : null
  }

}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
