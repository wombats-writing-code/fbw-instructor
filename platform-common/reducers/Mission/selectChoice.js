


// action type
export const SELECT_CHOICE = 'SELECT_CHOICE'


// action
export function selectChoice(choiceId) {
  return {type: SELECT_CHOICE, choiceId};
}
