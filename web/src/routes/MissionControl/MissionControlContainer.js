import { connect } from 'react-redux'
import MissionControl from './MissionControl'

import {createMission} from '../../reducers/Mission/createMission'
import {updateMission} from '../../reducers/Mission/updateMission'
import {updateMissionForm} from '../../reducers/Mission/updateMissionForm'
import {updateEditMissionForm} from '../../reducers/Mission/updateEditMissionForm'

import {changeView} from '../../reducers/view'

import {moduleTreeSelector} from './selectors/'
import {itemsForDirectivesSelector} from './selectors/'


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAddMission: (newMission, bankId, directivesItemsMap, itemBankId) => {
      dispatch(createMission(newMission, bankId, directivesItemsMap, itemBankId));
      setTimeout( () => {       // this time out really should not be here but too lazy to do it right now before demo and dashboard will need to change anyways
        dispatch(changeView({name: 'dashboard.preflightView', mission: newMission}))
      }, 2000);
    },
    // onSelectModule: (module) => dispatch(selectModule(module)),
    onUpdateMission: (newMission, bankId) => { dispatch(updateMission(newMission, bankId)) },
    updateMissionForm: (missionFormData) => { dispatch(updateMissionForm(missionFormData)) },
    updateEditMissionForm: (missionFormData) => { dispatch(updateEditMissionForm(missionFormData)) }
  }
}

const mapStateToProps = (state, ownProps) => {
  // haven't decided if this should be passed down as props or from state yet
  return {
    view: state.view,
    mission: state.mission.currentMission,
    newMission: state.mission.newMission,
    currentBank: state.bank.currentBank,
    itemBankId: state.bank.items ? state.bank.items[0].bankId : null, // need this to create the directives correctly on server-side
    editMission: state.mission.editMission,
    moduleTree: moduleTreeSelector(state),
    numberItemsForDirectives: itemsForDirectivesSelector(state),
    isCreateMissionInProgress: state.mission.isCreateMissionInProgress
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MissionControl)
