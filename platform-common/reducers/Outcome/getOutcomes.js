import _ from 'lodash'
import axios from 'axios'

import { getDomain, save } from '../../utilities'

// ----
// Action types
export const RECEIVE_OUTCOMES = 'RECEIVE_OUTCOMES'
export const GET_OUTCOMES_OPTIMISTIC = 'GET_OUTCOMES_OPTIMISTIC'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveOutcomes (outcomes) {
  return { type: RECEIVE_OUTCOMES, outcomes }
}

export function getOutcomesOptimistic (data) {
  return { type: GET_OUTCOMES_OPTIMISTIC, data }
}

// returns a list of outcomes for all FbW courses
export function getOutcomes () {
  return function (dispatch) {
    // console.log('getMissions of', bankId);
    dispatch(getOutcomesOptimistic())
    let departments = ['accounting', 'algebra']
    let getOutcomePromises = []
    _.each(departments, (department) => {
      getOutcomePromises.push(axios.get(`${getDomain()}/middleman/departments/${department}/outcomes`))
    })
    return axios.all(getOutcomePromises)
    .then((outcomes) => {
      //console.log('received getting banks', banks)
      outcomes = _.flatten(_.map(outcomes, 'data'))
      save('outcomes', outcomes)
      dispatch(receiveOutcomes(outcomes))
    })
    .catch((error) => {
      console.log('error getting outcomes', error)
    })
  }
}
