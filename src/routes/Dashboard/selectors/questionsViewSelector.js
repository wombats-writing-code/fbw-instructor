import { createSelector } from 'reselect'
import 'lodash'
import 'moment'
import 'moment-timezone'

import {getResults, getMapping} from './common'

export const questionsViewSelector = createSelector([getResults, getMapping], (results, mapping) => {

  let questions = _.flatMap(results, 'questions');
  console.log('questionsViewSelector results', results, ' questions', questions);

  return {
    questions
  };
});
