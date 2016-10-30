
'use strict';
import React, {  Component} from 'react';

import 'lodash'

// let _ = require('lodash');
// let dao = require('rhumbl-dao');
//
// import Xoces from 'xoces/components'
// import {isTarget} from '../../../selectors/selectors'
// import {uniqueQuestions, correctWithinAttempts} from '../processResults'
//

let styles = {
  svg: {
    // borderWidth: 1,
    // borderColor: '#ccc'
  }
};


const getSVGDimensions = () => {
   let d = document, root= d.documentElement, body= d.body;
   let width = window.innerWidth || root.clientWidth || body.clientWidth;
   let height = window.innerHeight || root.clientHeight || body.clientHeight ;
   let sidePadding = 21;

  return {height: height - 80, width: width*3.2/4.2 - sidePadding*2}
}


export const OutcomesViewWeb = (props) => {
  let data = props.outcomesViewData;

  if (!(data && data.nodes && data.links)) {
    return <p>Outcomes View</p>;
  }

  let {height, width} = getSVGDimensions();

  // render edges as lines
  let edges = _.map(data.links, (edge, idx) => {
    return (
      <line id={edge.id} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke={edge.stroke}
            strokeWidth={edge.strokeWidth} onMouseOver={() => props.onEdgeMouseover(edge, 'outcomesView')}
            key={edge.id}
      />
    )
  });

  // render nodes as circles
  let nodes = _.map(data.nodes, (node, idx) => {
    return (
      <circle id={node.id} cx={node.x} cy={node.y} r={node.r}
              fill={node.fill} stroke={node.stroke} strokeWidth={node.strokeWidth}
              onClick={() => props.onNodeClick(node, 'outcomesView')}
              onMouseOver={() => props.onNodeMouseover(node, 'outcomesView')} onMouseLeave={() => props.onNodeMouseover(null, 'outcomesView')}
              key={node.id}
      />
    )
  });

  // ===
  // render nodeBottomLabels
  let nodeBottomLabelsTruncated = _.compact(_.map(data.nodeBottomLabelsTruncated, (label, idx) => {
    if (props.viewState.currentMouseOver && label.entity.id === props.viewState.currentMouseOver.id) return null;

    return (
      <text key={idx+1} x={label.x} y={label.y} textAnchor="middle"
            fontSize={label.fontSize}>
        {label.text || ''}
      </text>
    )
  }));


  // only show the ones that are either currently mouseover'ed or click'ed on
  let nodeBottomLabelsFull = _.compact(_.map(data.nodeBottomLabelsFull, (label, idx) => {
    if (props.viewState.currentMouseOver && label.entity.id === props.viewState.currentMouseOver.id) {
      return (
        <text key={idx+1} x={label.x} y={label.y} textAnchor="middle"
              fontSize={label.fontSize}>
          {label.text || ''}
        </text>
      )
    }

    return null;
  }));

  return (
    <svg height={height} width={width} style={styles.svg}>
      {edges}
      {nodes}
      {nodeBottomLabelsTruncated}
      {nodeBottomLabelsFull}
    </svg>
  )
}

  // }
  //
  // _isMastered(outcome, takenResults, numberTries) {
  //   let questionsWithOutcome = _.reduce(props.takenResults, (result, response) => {
  //     let learningObjectiveIds = _.flatMap(response.questions, 'learningObjectiveIds');
  //     // console.log('response.questions', response.questions)
  //     // console.log('learningObjectiveIds', learningObjectiveIds)
  //     let idx = learningObjectiveIds.indexOf(outcome.id);
  //     if (idx > -1) {
  //       result.push(response.questions[idx]);
  //     }
  //     return result;
  //   }, []);
  //
  //   console.log('outcome', outcome.name, 'questionsWithOutcome', questionsWithOutcome);
  //
  //   let flag = false;
  //   for (let question of questionsWithOutcome) {
  //     if (correctWithinAttempts(question.id, takenResults, numberTries)) {
  //         flag = true;
  //         break;
  //     }
  //   }
  //
  //   return flag;
  // }
  //
  // _getNodeFill(outcome) {
  //   // these are the outcomes that actually appear in the results
  //   let outcomeIds = _.uniq(_.flatMap(props.takenResults, (response) => _.flatMap(response.questions, 'learningObjectiveIds')));
  //   let isOutcomeInTakenResults = outcomeIds.indexOf(outcome.id) > -1;
  //
  //   if (!isOutcomeInTakenResults) {
  //     return '#ccc';
  //   } else {
  //
  //     if (this._isMastered(outcome, props.takenResults, props.maxAttempts)) {
  //        return '#AAD8B0';          // return green if outcome is 'mastered'
  //     }
  //
  //     return '#FF6F69';             // return red if outcome is not mastered
  //   }
  //
  //   // let outcomes = _.map(outcomeIds, (id) => {
  //   //   let outcome = ModuleStore.getOutcome(id)
  //   //   return _.assign({}, outcome, {
  //   //     type: 'outcome',
  //   //     name: outcome.displayName.text
  //   //   })
  //   // });
  // }
  //

  //
  // onPressIn() {
  //   console.log('press in');
  // }
