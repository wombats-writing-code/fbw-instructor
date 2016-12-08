
// ----
// Action types
export const RECEIVE_SET_BANKS = 'RECEIVE_SET_BANKS'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveSetBanks (bankIds) {
  return { type: RECEIVE_SET_BANKS, bankIds }
}

// sets the enrolled (d2l) bankIds in the global state / local storage
export function setBanks (bankIds) {
  return function (dispatch) {
    // save('enrolledBankIds', bankIds)
    dispatch(receiveSetBanks(bankIds))
  }
}
