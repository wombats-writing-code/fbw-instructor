


// action type
export const SELECT_DIRECTIVE = 'SELECT_DIRECTIVE'


// action
export function selectDirective(directiveIndex) {
  return {type: SELECT_DIRECTIVE, directiveIndex};
}
