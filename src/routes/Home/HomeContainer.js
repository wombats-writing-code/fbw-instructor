import { connect } from 'react-redux'
import Home from './Home'

import {getMapping} from '../../reducers/Mapping/getMapping'
import {getMissions} from '../../reducers/Mission/getMissions'

import {getBanks} from '../../reducers/Bank/getBanks'
import {selectBank} from '../../reducers/Bank/selectBank'

import {selectMission} from '../../reducers/Mission/selectMission'
import {changeView} from '../../reducers/view'

import {getResults} from '../../reducers/Mission/getResults'

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
    getBanks: () => dispatch(getBanks()),     // this gets called when the Home component mounts
    onClickBank: (bank) => {
      dispatch(selectBank(bank));
      dispatch(getMissions(bank.id));
      dispatch(getMapping(bank.id, ['accounting']))     // @Cole: how do I find out the department name from the bank name?
    },
    onClickMission: (mission) => {
      dispatch(getResults(mission));
      dispatch(selectMission(mission));
      dispatch(changeView({name: 'dashboard.outcomesView', mission: mission}))
    },
    onClickAddMission: () => dispatch(changeView({name: 'add-mission'})),
    onClickEditMission: (mission) => {
      dispatch(selectMission(mission));
      dispatch(changeView({name: 'edit-mission', mission: mission}));
    },
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('state', state);

  return {
    banks: state.bank ? state.bank.banks : [],
    currentBank: state.bank.currentBank ? state.bank.currentBank : null,
    missions: state.mission ? state.mission.missions : [],
    currentMission: state.mission ? state.mission.currentMission : null,
    view: state.view
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
