import axios from 'axios'

import {
  getDomain
} from '../common'


// action type
export const RECEIVE_SELECT_BANK = 'RECEIVE_SELECT_BANK'
export const SELECT_BANK_OPTIMISTIC = 'SELECT_BANK_OPTIMISTIC'

export function receiveSelectBank (privateBankId) {
  return { type: RECEIVE_SELECT_BANK, privateBankId }
}

export function selectBankOptimistic (bank) {
  return { type: SELECT_BANK_OPTIMISTIC, bank }
}

// do this for instructors, too, so that there is
//   a faster path to get missions
export function selectBank(bank) {
  return function (dispatch) {
    dispatch(selectBankOptimistic(bank))

    let options = {
      url: `${getDomain()}/middleman/banks/${bank.id}/privatebankid`,
      headers: {
        'x-fbw-username': 'instructor'
      }
    }
    // we need to make sure this is set-up at least one-time...
    return axios(options)
    .then((privateBankId) => {
      console.log('got from middleman the selected subject\'s privateBankId of:', privateBankId);

      // dispatch(receiveSelectSubject(privateBankId.data))
      // let's keep the termBankId in the state tree, since we can now
      //   calculate the privateBankId using fbwUtils
      dispatch(receiveSelectBank(privateBankId.data))
    })
    .catch((error) => {
      console.log('error getting private bank', error)
    })
  }
}
