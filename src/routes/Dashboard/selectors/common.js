
let moment = require('moment')

export const getResults = (state) => state.mission ? state.mission.results : null
export const getMapping = (state) => state.mapping

export const isTarget = (question) => {
  if (question && question.displayName) {
    return question.displayName.text.indexOf('.') < 0;
  }

  return undefined;
}

/**
  notCorrectWithinAttempts:
  returns {# of students who did not get this question right within N attempts, # of total students who attempted}
*/
export const notAchievedWithinAttempts = (questionId, takenResults, maxAttempts) => {

  let total = [];
  let notAchieved = _.compact(_.map(takenResults, (taken) => {

    let numAttempts = 0;
    let responses = grabAndSortResponses(taken.questions, questionId);    // gets all responses for this questionId
    if (responses.length > 0) total.push(responses);

    for (let i=0; i<responses.length; i++) {
      let response = responses[i];
      if (!response.isCorrect) {
        numAttempts++;
      }

      // console.log(response, 'numAttempts', numAttempts, maxAttempts, 'max attempt');

      // if the response is not correct, and the number of student attempts equals or exceeded the given attempt number,
      // then we say the student has not achieved
      // TODO: clean this up somehow? This could still be Wrong / Right / Wrong pattern
      if (!response.isCorrect && numAttempts >= maxAttempts) {
        //console.log(_.filter(taken.questions, {'itemId': questionId}));
        return taken;
      }
    }

    return null;
  }));

  return {notAchieved, total}
}

/* standardize how to extract and sort the responses, based on
submissionTime. Given a taken and itemId*/
export const grabAndSortResponses = (questionsList, itemId) => {
 let responses = _.compact(_.flatMap(_.filter(questionsList, {'itemId': itemId}), 'responses'));
 responses = _.orderBy(responses, sortBySubmissionTime);
 return responses;
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
