// used for logging out a user
// ----
// Action types
export const RECEIVE_RESET_BANK_STATE = 'RECEIVE_RESET_BANK_STATE'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveResetBankState (data) {
  return { type: RECEIVE_RESET_BANK_STATE, data }
}

export function resetBankState () {
  return function (dispatch) {
    dispatch(receiveResetBankState())
  }
}
