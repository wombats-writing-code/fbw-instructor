import { connect } from 'react-redux'
import Home from './Home'

import {browserHistory} from 'react-router'

import {getMapping} from '../../reducers/Mapping/getMapping'
import {getMissions} from '../../reducers/Mission/getMissions'

import {getBanks} from '../../reducers/Bank/getBanks'
import {selectBank} from '../../reducers/Bank/selectBank'

import {getItems} from '../../reducers/Bank/getItems'

import {selectMission} from '../../reducers/Mission/selectMission'
import {clearSelectedMission} from '../../reducers/Mission/clearSelectedMission'
import {changeView} from '../../reducers/view'

import {getPhaseIResults} from '../../reducers/Mission/getPhaseIResults'
import {getPhaseIIResults} from '../../reducers/Mission/getPhaseIIResults'

import {deleteMission} from '../../reducers/Mission/deleteMission'

// this should ONLY be used for simpleLogin / non-LMS installs. This is NOT scalable.
// import {BANK_TO_DOMAIN, BANK_TO_LIBRARY} from '../../reducers/common'
import {findBankLibrary, findBankDomain} from 'fbw-platform-common/selectors'

/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, the counter:   */

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getMissions: (bankId) => dispatch(getMissions(bankId)),    // this gets called when the Home component mounts
    getBanks: (bankIds) => dispatch(getBanks(bankIds)),     // this gets called when the Home component mounts

    onClickBank: (bank, enrolledBanks) => {
      dispatch(selectBank(bank));
      dispatch(getMissions(bank.id));
      dispatch(selectMission(null));
      console.log('domain: ', findBankDomain(bank.id, enrolledBanks))
      dispatch(getMapping(findBankDomain(bank.id, enrolledBanks)))     // @Cole: how do I find out the department name from the bank name?
      dispatch(getItems(findBankLibrary(bank.id, enrolledBanks)));  // these two mappings need to be modified after we switch to D2L / LMS
    },
    onClickMission: (mission) => {
      dispatch(getPhaseIResults(mission));
      dispatch(selectMission(mission));
      dispatch(changeView({name: 'dashboard.resultsView', mission: mission}))      // true default
    },
    onClickAddMission: () =>
    {
      dispatch(clearSelectedMission())
      dispatch(changeView({name: 'add-mission'}))
      // browserHistory.push('/missions/new')
    },
    onClickEditMission: (mission) => {
      dispatch(selectMission(mission));
      dispatch(changeView({name: 'edit-mission', mission: mission}));
    },
    onClickDeleteMission: (mission) => {
      dispatch(deleteMission(mission))
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('state', state);
  // console.log('offeredId:', state.mission && state.mission.currentMission ? state.mission.currentMission.assessmentOfferedId : null)

  return {
    enrolledBanks: state.bank ? state.bank.enrolledBanks : null,
    banks: state.bank ? state.bank.banks : [],
    currentBank: state.bank.currentBank ? state.bank.currentBank : null,
    missions: state.mission ? state.mission.missions : [],
    currentMission: state.mission ? state.mission.currentMission : null,
    isGetMissionsInProgress: state.mission ? state.mission.isGetMissionsInProgress : null,
    view: state.view,
    d2lToken: state.user.d2l.authenticatedUrl ? state.user.d2l.authenticatedUrl : null
  }

}

/*  Note: mapStateToProps is where you should use `reselect` to create selectors, ie:

    import { createSelector } from 'reselect'
    const counter = (state) => state.counter
    const tripleCount = createSelector(counter, (count) => count * 3)
    const mapStateToProps = (state) => ({
      counter: tripleCount(state)
    })

    Selectors can compute derived data, allowing Redux to store the minimal possible state.
    Selectors are efficient. A selector is not recomputed unless one of its arguments change.
    Selectors are composable. They can be used as input to other selectors.
    https://github.com/reactjs/reselect    */

export default connect(mapStateToProps, mapDispatchToProps)(Home)
