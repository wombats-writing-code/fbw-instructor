import { connect } from 'react-redux'
import Home from './Home'
import {getAssessments, receiveAssessments} from '../../reducers/Assessment/getAssessments'

/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, the counter:   */

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapDispatchToProps = (dispatch) => {
  return {
    getAssessments: (bankId) => dispatch(getAssessments(bankId))
  }
}

const mapStateToProps = (state) => ({
  // let's load all of our data here that we need. hardcoding this bank Id for now
  missions: state.missions,
  // bankId: 'assessment.Bank%3A576d6d3271e4828c441d721a' + '@bazzim.MIT.EDU'
  bankId: 'assessment.Bank:57d70ed471e482a74879349a' + '@bazzim.MIT.EDU'
})

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
