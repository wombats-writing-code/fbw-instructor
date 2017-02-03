import { connect } from 'react-redux'
import MissionForm from './MissionForm'

import {createMission} from 'fbw-platform-common/reducers/edit-mission/createMission'
import {updateMission} from 'fbw-platform-common/reducers/edit-mission/updateMission'
import {updateMissionForm} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
// import {updateEditMissionForm} from 'fbw-platform-common/reducers/edit-mission/updateEditMissionForm'

import {changeView} from '../../reducers/view'

import {moduleTreeSelector, itemsForDirectivesSelector, displayedDirectivesSelector} from './selectors/'


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAddMission: (newMission, bankId, directivesItemsMap, itemBankId) => {
      dispatch(createMission(newMission, bankId, directivesItemsMap, itemBankId));
      setTimeout( () => {       // this time out really should not be here but too lazy to do it right now before demo and dashboard will need to change anyways
        dispatch(changeView({name: 'dashboard.resultsView', mission: newMission}))
      }, 2000);
    },
    // onSelectModule: (module) => dispatch(selectModule(module)),
    onUpdateMission: (newMission, bankId, directiveItemsMap, itemBankId) => {
      dispatch(updateMission(newMission, bankId, directiveItemsMap, itemBankId));
      setTimeout( () => {       // this time out really should not be here but too lazy to do it right now before demo and dashboard will need to change anyways
        dispatch(changeView({name: 'dashboard.resultsView', mission: newMission}))
      }, 2000);
    },
    updateMissionForm: (missionFormData) => { dispatch(updateMissionForm(missionFormData)) },
    //updateEditMissionForm: (missionFormData) => { dispatch(updateEditMissionForm(missionFormData)) }
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log('state in MissionFormContainer', state);

  // haven't decided if this should be passed down as props or from state yet
  return {
    view: state.view,
    // mission: state.mission.currentMission,
    newMission: state.editMission.newMission,
    editMission: state.editMission.editMission,
    isCreateMissionInProgress: state.editMission.isCreateMissionInProgress,
    currentBank: state.bank.currentBank,
    itemBankId: state.bank.items ? state.bank.items[0].bankId : null, // need this to create the directives correctly on server-side
    moduleTree: moduleTreeSelector(state),
    displayedDirectives: displayedDirectivesSelector(state, ownProps),
    numberItemsForDirectives: itemsForDirectivesSelector(state),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MissionForm)
