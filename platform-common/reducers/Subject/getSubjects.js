
import _ from 'lodash'
import axios from 'axios'

import { getDomain } from '../../utilities'

// ----
// Action types
export const RECEIVE_SUBJECTS = 'RECEIVE_SUBJECTS'
export const GET_SUBJECTS = 'GET_SUBJECTS'
export const GET_SUBJECTS_OPTIMISTIC = 'GET_SUBJECTS_OPTIMISTIC'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveSubjects (subjects) {
  return { type: RECEIVE_SUBJECTS, subjects }
}

export function getSubjectsOptimistic (data) {
  return { type: GET_SUBJECTS_OPTIMISTIC, data }
}

// returns a list of Banks
export function getSubjects (bankIds) {
  return function (dispatch) {
    // console.log('getMissions of', bankId);
    dispatch(getSubjectsOptimistic())
    let getBankPromises = []
    _.each(bankIds, (bankId) => {
      getBankPromises.push(axios.get(`${getDomain()}/middleman/banks/${bankId}`))
    })
    return axios.all(getBankPromises)
    .then((banks) => {
      // console.log('received getting banks', banks)
      let subjects = _.map(banks, 'data')
      // console.log(subjects)
      dispatch(receiveSubjects(subjects))
    })
    .catch((error) => {
      console.log('error getting subjects data', error)
    })
  }
}
