import { createSelector } from 'reselect'
import _ from 'lodash'
import 'moment'
import 'moment-timezone'

// import 'Xoces/dist/Xoces'
let Xoces = require('Xoces/dist/Xoces');      // TODO: luwen to refactor Xoces and make it es6 compat

import getIncomingEntitiesAll from 'rhumbl-dao/src/getIncomingEntitiesAll'
import getPathway from 'rhumbl-dao/src/getPathway'
import rankDAG from 'rhumbl-dao/src/rankDAG'

export const isTarget = (question) => {
  if (question && question.displayName) {
    return question.displayName.text.indexOf('.') < 0;
  }

  return undefined;
}


/**
  layoutSelector(): given an array of outcomes you want to display, and the entire graph you want to compute on,
                  returns the positions and styling of the outcomes and their relevant relationships
*/
export const outcomesViewSelector = (results, mapping) => {
  if (!results || !mapping) return null;

  let graph = {
    entities: _.map(mapping.outcomes, (outcome) => {
      return _.assign({}, outcome, {
        type: 'outcome',
        name: outcome.displayName.text
      })
    }),
    relationships: _.map(mapping.relationships, (rel) => {
      return _.assign({}, rel, {
        targetId: rel.destinationId
      });
    }),
  };

  console.log('results', results, 'mapping', graph);

  let targetQuestions =  _.filter(_.uniqBy(_.flatMap(results, 'questions'), 'itemId'), (q) => isTarget(q));
  let targetOutcomes = _.compact(_.map(_.uniq(_.flatMap(targetQuestions, 'learningObjectiveIds')), (id) => _.find(graph.entities, {id: id})));

  console.log('targetQuestions', targetQuestions);
  console.log('targetOutcomes', targetOutcomes);
    // console.log('outcomes', _.map(outcomes, 'displayName.text'))

  // get the entire Directed Acyclic Graph that concerns the target outcomes
  // note that this DAG may contain outcomes that didn't show up in the taken results
  let dag = getPathway(_.map(targetOutcomes, 'id'), ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], 'OUTGOING_ALL', graph);
  console.log('dag', dag);

  let ranked = rankDAG(dag, (item) => getIncomingEntitiesAll(item.id, ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], graph));
  console.log('ranked', ranked);

  console.log('Xoces', Xoces, xoces);

  //
  // let {height, width} = this._getSVGDimensions();
  let params = {
    drawing: {
      background: '#eee',
      width: 800,
      height: 600,
    },
    node: {
      r: 20,
      stroke: '#cccccc',
      strokeWidth: 1,
      borderRadius: '50%',
    },
    nodeCenterLabel: {
      fontSize: 12,
      property: (outcome) => {
          return outcome.id.split('%')[1];
      }
    },
    nodeBottomLabel: {
      fontSize: 12,
      property: outcome => _.truncate(outcome.name, {lenght: 40})
    }
  };

  let layout = xoces.tree.layout(params, ranked, dag.edges);

  // assign coloring to nodes
  layout.nodes = _.map(layout.nodes, (node) => {
    return _.assign({}, node, {
      fill: '#B5E655'
    });
  });

  // assign coloring to links
  layout.links = _.map(layout.links, (link) => {
    return _.assign({}, link, {
      stroke: '#ccc',
      strokeWidth: 1
    })
  });

  console.log('layout', layout);

  return layout;
}

  //
  //   // get all outcomes
  //   let allOutcomes = _.map(_.toArray(ModuleStore.getOutcomes()), (outcome) => {
  //     return _.assign({}, outcome, {
  //       type: 'outcome',
  //       name: outcome.displayName.text
  //     })
  //   });
  //
  // }


//
//
// export const uniqueQuestions = (takenResults) => {
//   return _.uniqBy(_.flatMap(takenResults, 'questions'), 'itemId');
// }
//
// /* given a list of responses, a questionId and the number of attempts,
// calculate how many students did not get it correct within numAttempts
// **/
// // Note that this calculation means that the student may NOT have ever gotten it right
// export const notCorrectWithinAttempts = (questionId, takenResults, maxAttempts) => {
//
//   return _.compact(_.map(takenResults, (taken) => {
//     // console.log(taken);
//
//     // let question = _.find(taken.questions, {itemId: questionId});
//
//     let numAttempts = 0;
//     let numSeen = 0;
//     let responses = grabAndSortResponses(taken.questions, questionId);
//     for (let i=0; i<responses.length; i++) {
//       let response = responses[i];
//       if (!response.isCorrect) {
//         numAttempts++;
//       }
//
//       // console.log(response, 'numAttempts', numAttempts, maxAttempts, 'max attempt');
//
//       // if the response is not correct, and the number of student attempts equals or exceeded the given attempt number,
//       // then we say the student has not achieved
//       // TODO: clean this up somehow? This could still be Wrong / Right / Wrong
//       //    pattern ...
//       if (!response.isCorrect && numAttempts >= maxAttempts) {
//         //console.log(_.filter(taken.questions, {'itemId': questionId}));
//         return taken;
//       }
//     }
//
//     return null;
//   }));
//
// }
//
// /* standardize how to extract and sort the responses, based on
// submissionTime. Given a taken and itemId*/
// export const grabAndSortResponses = (questionsList, itemId) => {
//  let responses = _.compact(_.concat([], _.flatten(_.map(_.filter(questionsList, {'itemId': itemId}), 'responses'))));
//  responses = _.orderBy(responses, sortBySubmissionTime);
//  return responses;
// }
//
// /* Kind of a hack ... we know that FbW choiceIds are unique
// in the system, even across questions.
// */
// export const grabQuestionByChoiceId = (takenResults, choiceId) => {
//   let questions = uniqueQuestions(takenResults);
//   return _.find(questions, (question) => {
//     let choiceIds = _.map(question.choices, 'id');
//     return choiceIds.indexOf(choiceId) >= 0;
//   });
// }
//
// /* To populate the student response matrix, we need to count the number of
//  students who select choice X in their Yth attempt.
//
//  Sort the submissions by time?
// */
// export const selectedChoiceXWithinAttempts = (takenResults, choiceId, maxAttempts, surrenderCount) => {
//   let attemptsCounter = _.range(maxAttempts).map(() => {return 0;});
//   let itemId = grabQuestionByChoiceId(takenResults, choiceId).itemId;
//   _.each(takenResults, (taken) => {
//     let responses = grabAndSortResponses(taken.questions, itemId);
//     for (let i=1; i<=maxAttempts; i++) {
//       let shiftedIndex = i - 1;
//
//       if (responses.length >= i) {
//         if (!responses[shiftedIndex].isCorrect) {
//           if (responses[shiftedIndex].choiceIds.length == 0 && surrenderCount) {
//             // when surrendering, show it separately
//             attemptsCounter[shiftedIndex]++;
//           } else if (responses[shiftedIndex].choiceIds[0] == choiceId && !surrenderCount) {
//             attemptsCounter[shiftedIndex]++;
//           }
//         }
//       }
//     }
//   });
//   return attemptsCounter;
// }
//
// export const correctWithinAttempts = (questionId, takenResults, maxAttempts) => {
//
//   return _.compact(_.map(takenResults, (taken) => {
//     // console.log(taken);
//     // let question = _.find(taken.questions, {itemId: questionId});
//     let numAttempts = 0;
//     let numSeen = 0;
//     for (let i=0; i<taken.questions.length; i++) {
//       let question = taken.questions[i];
//
//       // match the question by its itemId
//       if (question.itemId === questionId) {
//         numSeen++;
//
//         // console.log('matched question. its reponses', question.responses[0]);
//         let response = question.responses[0];
//
//         if (response) {
//           numAttempts++;
//
//           // console.log(response, 'numAttempts', numAttempts, maxAttempts, 'max attempt');
//
//           // if the response is not correct, and the number of student attempts equals or exceeded the given attempt number,
//           // then we say the student has not achieved
//           if (response.isCorrect && numAttempts <= maxAttempts) {
//             return taken;
//           }
//         }
//
//       }
//     }
//
//     return null;
//   }));
// }
//
// export const sortBySubmissionTime  = (responseA, responseB) => {
//   if (responseA && responseB) {
//     if (typeof responseA.submissionTime !== "undefined" && typeof responseB.submissionTime !== "undefined") {
//       return moment(responseA.submissionTime).unix() < moment(responseB.submissionTime).unix();
//     } else if (typeof responseA.submissionTime !== "undefined") {
//       return false;
//     } else if (typeof responseB.submissionTime !== "undefined") {
//       return true;
//     } else {
//       return true; // arbitrarily let the first unanswered response be <
//     }
//   } else if (responseA) {
//     return false;
//   } else if (responseB) {
//     return true;
//   } else {
//     return true;
//   }
// }
