import { createSelector } from 'reselect'
import 'lodash'
import 'moment'
import 'moment-timezone'

// import 'Xoces/dist/Xoces'
let Xoces = require('Xoces/dist/Xoces');      // TODO: luwen to refactor Xoces and make it es6 compat

import getIncomingEntitiesAll from 'rhumbl-dao/src/getIncomingEntitiesAll'
import getPathway from 'rhumbl-dao/src/getPathway'
import rankDAG from 'rhumbl-dao/src/rankDAG'

import {getResults, getMapping, isTarget} from './common'

/**
  outcomesViewSelector(): given an array of outcomes you want to display, and the entire graph you want to compute on,
                  returns the positions and styling of the outcomes and their relevant relationships
*/
export const outcomesViewSelector = createSelector([getResults, getMapping], (results, mapping) => {
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

  // console.log('results', results, 'mapping', graph);

  let allQuestions = _.flatMap(results, 'questions');

  let targetQuestions =  _.filter(_.uniqBy(allQuestions, 'itemId'), (q) => isTarget(q));
  let targetOutcomes = _.compact(_.map(_.uniq(_.flatMap(targetQuestions, 'learningObjectiveIds')), (id) => _.find(graph.entities, {id: id})));


  // !temporary until i ask Cole
  targetOutcomes = [targetOutcomes[0], targetOutcomes[1]];

  // console.log('targetQuestions', targetQuestions);
  // console.log('targetOutcomes', targetOutcomes);
  // console.log('targetOutcomes', _.map(targetOutcomes, 'displayName.text'))

  // get the entire Directed Acyclic Graph that concerns the target outcomes
  // note that this DAG may contain outcomes that didn't show up in the taken results
  let dag = getPathway(_.map(targetOutcomes, 'id'), ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], 'OUTGOING_ALL', graph);
  // console.log('dag', dag);

  let ranked = rankDAG(dag, (item) => getIncomingEntitiesAll(item.id, ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], graph));
  // console.log('ranked', ranked);

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
      stroke: '#fff',
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
      property: outcome => _.truncate(outcome.name, {length: 40})
    }
  };

  let layout = xoces.tree.layout(params, ranked, dag.edges);

  // =======
  // build out layout object, need to refactor this out
  // =====
  // assign coloring to nodes
  layout.nodes = _.map(layout.nodes, (node) => {
    let questions = _.filter(allQuestions, (q) => q.learningObjectiveIds.indexOf(node.id) > -1);
    let numCorrect = correctWithinAttempts(_.map(questions, 'itemId'), results, 1);
    let didClassMaster = numCorrect.length / results.length;

    // console.log('num correct', numCorrect);

    return _.assign({}, node, {
      fill: didClassMaster > .5 ? '#AAD8B0' : '#FF6F69'
    });
  });

  // assign coloring to links
  layout.links = _.map(layout.links, (link) => {
    return _.assign({}, link, {
      stroke: '#ccc',
      strokeWidth: 3
    })
  });

  layout.nodeBottomLabelsTruncated = layout.nodeBottomLabels;
  layout.nodeBottomLabelsFull = _.map(layout.nodeBottomLabels, (label) => {
    return _.assign({}, label, {
      text: label.entity.name
    })
  })

  // console.log('layout', layout);

  return layout;
})

/**
  correctWithinAttempts: takes a single question id or array of question ids, and searches
*/
export const correctWithinAttempts = (questionIdOrIds, takenResults, maxAttempts) => {

  let questionIds;
  if (!_.isArray(questionIdOrIds)) {
    questionIds = [questionIdOrIds];
  } else {
    questionIds = questionIdOrIds;
  }

  return _.compact(_.map(takenResults, (taken) => {
    // console.log(taken);
    // let question = _.find(taken.questions, {itemId: questionId});
    let numAttempts = 0;
    let numSeen = 0;
    for (let i=0; i<taken.questions.length; i++) {
      let question = taken.questions[i];

      // match the question by its itemId
      if (questionIds.indexOf(question.itemId) > -1) {
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

//
// }
//

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

//

//


/* To populate the student response matrix, we need to count the number of
 students who select choice X in their Yth attempt.

 Sort the submissions by time?
*/
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
//
//   return attemptsCounter;
// }
