

export const getResults = (state) => state.mission ? state.mission.results : null
export const getMapping = (state) => state.mapping

export const isTarget = (question) => {
  if (question && question.displayName) {
    return question.displayName.text.indexOf('.') < 0;
  }

  return undefined;
}
