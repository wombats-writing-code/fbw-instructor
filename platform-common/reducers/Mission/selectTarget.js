


// action type
export const SELECT_TARGET = 'SELECT_TARGET'


// action
export function selectTarget(targetIndex) {
  return {type: SELECT_TARGET, targetIndex};
}
