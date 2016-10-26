
import _ from 'lodash'
let moment = require('moment');
require('moment-timezone');

export const uniqueQuestions = (takenResults) => {
  return _.uniqBy(_.flatMap(takenResults, 'questions'), 'itemId');
}

/* given a list of responses, a questionId and the number of attempts,
calculate how many students did not get it correct within numAttempts
**/
// Note that this calculation means that the student may NOT have ever gotten it right
export const notCorrectWithinAttempts = (questionId, takenResults, maxAttempts) => {

  return _.compact(_.map(takenResults, (taken) => {
    // console.log(taken);

    // let question = _.find(taken.questions, {itemId: questionId});

    let numAttempts = 0;
    let numSeen = 0;
    let responses = grabAndSortResponses(taken.questions, questionId);
    for (let i=0; i<responses.length; i++) {
      let response = responses[i];
      if (!response.isCorrect) {
        numAttempts++;
      }

      // console.log(response, 'numAttempts', numAttempts, maxAttempts, 'max attempt');

      // if the response is not correct, and the number of student attempts equals or exceeded the given attempt number,
      // then we say the student has not achieved
      // TODO: clean this up somehow? This could still be Wrong / Right / Wrong
      //    pattern ...
      if (!response.isCorrect && numAttempts >= maxAttempts) {
        //console.log(_.filter(taken.questions, {'itemId': questionId}));
        return taken;
      }
    }

    return null;
  }));

}

/* standardize how to extract and sort the responses, based on
submissionTime. Given a taken and itemId*/
export const grabAndSortResponses = (questionsList, itemId) => {
 let responses = _.compact(_.concat([], _.flatten(_.map(_.filter(questionsList, {'itemId': itemId}), 'responses'))));
 responses = _.orderBy(responses, sortBySubmissionTime);
 return responses;
}

/* Kind of a hack ... we know that FbW choiceIds are unique
in the system, even across questions.
*/
export const grabQuestionByChoiceId = (takenResults, choiceId) => {
  let questions = uniqueQuestions(takenResults);
  return _.find(questions, (question) => {
    let choiceIds = _.map(question.choices, 'id');
    return choiceIds.indexOf(choiceId) >= 0;
  });
}

/* To populate the student response matrix, we need to count the number of
 students who select choice X in their Yth attempt.

 Sort the submissions by time?
*/
export const selectedChoiceXWithinAttempts = (takenResults, choiceId, maxAttempts, surrenderCount) => {
  let attemptsCounter = _.range(maxAttempts).map(() => {return 0;});
  let itemId = grabQuestionByChoiceId(takenResults, choiceId).itemId;
  _.each(takenResults, (taken) => {
    let responses = grabAndSortResponses(taken.questions, itemId);
    for (let i=1; i<=maxAttempts; i++) {
      let shiftedIndex = i - 1;

      if (responses.length >= i) {
        if (!responses[shiftedIndex].isCorrect) {
          if (responses[shiftedIndex].choiceIds.length == 0 && surrenderCount) {
            // when surrendering, show it separately
            attemptsCounter[shiftedIndex]++;
          } else if (responses[shiftedIndex].choiceIds[0] == choiceId && !surrenderCount) {
            attemptsCounter[shiftedIndex]++;
          }
        }
      }
    }
  });
  return attemptsCounter;
}

export const correctWithinAttempts = (questionId, takenResults, maxAttempts) => {

  return _.compact(_.map(takenResults, (taken) => {
    // console.log(taken);
    // let question = _.find(taken.questions, {itemId: questionId});
    let numAttempts = 0;
    let numSeen = 0;
    for (let i=0; i<taken.questions.length; i++) {
      let question = taken.questions[i];

      // match the question by its itemId
      if (question.itemId === questionId) {
        numSeen++;

        // console.log('matched question. its reponses', question.responses[0]);
        let response = question.responses[0];

        if (response) {
          numAttempts++;

          // console.log(response, 'numAttempts', numAttempts, maxAttempts, 'max attempt');

          // if the response is not correct, and the number of student attempts equals or exceeded the given attempt number,
          // then we say the student has not achieved
          if (response.isCorrect && numAttempts <= maxAttempts) {
            return taken;
          }
        }

      }
    }

    return null;
  }));
}

export const sortBySubmissionTime  = (responseA, responseB) => {
  if (responseA && responseB) {
    if (typeof responseA.submissionTime !== "undefined" && typeof responseB.submissionTime !== "undefined") {
      return moment(responseA.submissionTime).unix() < moment(responseB.submissionTime).unix();
    } else if (typeof responseA.submissionTime !== "undefined") {
      return false;
    } else if (typeof responseB.submissionTime !== "undefined") {
      return true;
    } else {
      return true; // arbitrarily let the first unanswered response be <
    }
  } else if (responseA) {
    return false;
  } else if (responseB) {
    return true;
  } else {
    return true;
  }
}
