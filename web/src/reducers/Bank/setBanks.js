
// ----
// Action types
export const RECEIVE_SET_BANKS = 'RECEIVE_SET_BANKS'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveSetBanks (banks) {
  return { type: RECEIVE_SET_BANKS, banks }
}

// sets the enrolled (d2l) banks in the global state / local storage
export function setBanks (banks) {
  return function (dispatch) {
    // save('enrolledBanks', banks)
    dispatch(receiveSetBanks(banks))
  }
}
