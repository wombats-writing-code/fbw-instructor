
'use strict';
import React, {
    Component,
} from 'react';

import {
  Dimensions,
  Animated,
  View,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

import Svg,{
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Text,
    Use,
    Defs,
    Stop
} from 'react-native-svg';

let _ = require('lodash');
let dao = require('rhumbl-dao');
let ModuleStore = require('../../../stores/Module');

import Xoces from 'xoces/components'
import {isTarget} from '../../../selectors/selectors'
import {uniqueQuestions, correctWithinAttempts} from '../processResults'


const sidePadding = 21;
let styles = {
  svg: {
    // borderWidth: 1,
    // borderColor: '#ccc'
  }
};

class TreeView extends Component {

  _getSVGDimensions() {
    let {height, width} = Dimensions.get('window');

    return {height: height - 80, width: width*3.2/4.2 - sidePadding*2}
  }

  render() {
    console.log('width', width);

    let layout = this._getLayout();

    if (!(layout && layout.nodes && layout.links)) {
      return null;
    }

    // render edges as lines
    let edges = _.map(layout.links, (edge, idx) => {
      console.log('edge', edge.x1, edge.y1);
      return (
        <Line id={edge.id} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke={edge.stroke}
              strokeWidth={edge.strokeWidth}
              key={edge.id}
        />
      )
    });


    // render nodes as circles
    let nodes = _.map(layout.nodes, (node, idx) => {
      console.log('node', node.x, node.y);
      return (
        <Circle id={node.id} cx={node.x} cy={node.y} r={node.r}
                fill={this._getNodeFill(node)} stroke={node.stroke} strokeWidth={node.strokeWidth}
                onPress={() => this.props.onPressNode(node)}
                key={node.id}
        />
      )
    });

    // render nodeBottomLabels
    let nodeBottomLabels = _.map(layout.nodeBottomLabels, (label, idx) => {
      // console.log(label);
      return (
        <Text key={idx+1} x={label.x} y={label.y} fontSize={label.fontSize} lineHeight={label.lineHeight}>
          {label.text || ''}
        </Text>
      )
    });

    let {height, width} = this._getSVGDimensions();

    return (
      <Svg height={height} width={width} style={styles.svg}>
        {edges}
        {nodes}
        {nodeBottomLabels}
      </Svg>
    )
  }

  _isMastered(outcome, takenResults, numberTries) {
    let questionsWithOutcome = _.reduce(this.props.takenResults, (result, response) => {
      let learningObjectiveIds = _.flatMap(response.questions, 'learningObjectiveIds');
      // console.log('response.questions', response.questions)
      // console.log('learningObjectiveIds', learningObjectiveIds)
      let idx = learningObjectiveIds.indexOf(outcome.id);
      if (idx > -1) {
        result.push(response.questions[idx]);
      }
      return result;
    }, []);

    console.log('outcome', outcome.name, 'questionsWithOutcome', questionsWithOutcome);

    let flag = false;
    for (let question of questionsWithOutcome) {
      if (correctWithinAttempts(question.id, takenResults, numberTries)) {
          flag = true;
          break;
      }
    }

    return flag;
  }

  _getNodeFill(outcome) {
    // these are the outcomes that actually appear in the results
    let outcomeIds = _.uniq(_.flatMap(this.props.takenResults, (response) => _.flatMap(response.questions, 'learningObjectiveIds')));
    let isOutcomeInTakenResults = outcomeIds.indexOf(outcome.id) > -1;

    if (!isOutcomeInTakenResults) {
      return '#ccc';
    } else {

      if (this._isMastered(outcome, this.props.takenResults, this.props.maxAttempts)) {
         return '#AAD8B0';          // return green if outcome is 'mastered'
      }

      return '#FF6F69';             // return red if outcome is not mastered
    }

    // let outcomes = _.map(outcomeIds, (id) => {
    //   let outcome = ModuleStore.getOutcome(id)
    //   return _.assign({}, outcome, {
    //     type: 'outcome',
    //     name: outcome.displayName.text
    //   })
    // });
  }

  _getLayout() {
    if (!(this.props.takenResults && this.props.relationships)) return null;

    let {height, width} = this._getSVGDimensions();
    let params = {
      drawing: {
        background: '#eee',
        width: width,
        height: height,
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
        property: outcome => _.truncate(outcome.name)
      }
    };


    // get all outcomes
    let allOutcomes = _.map(_.toArray(ModuleStore.getOutcomes()), (outcome) => {
      return _.assign({}, outcome, {
        type: 'outcome',
        name: outcome.displayName.text
      })
    });

    let targetQuestions =  _.filter(_.uniqBy(_.flatMap(this.props.takenResults, 'questions'), 'itemId'), (q) => isTarget(q));
    let targetOutcomes = _.map(_.uniq(_.flatMap(targetQuestions, 'learningObjectiveIds')), (id) => {
      let outcome = ModuleStore.getOutcome(id)
      return _.assign({}, outcome, {
        type: 'outcome',
        name: outcome.displayName.text
      })
    });;

    // console.log('outcomes', _.map(outcomes, 'displayName.text'))
    console.log('target questions', targetQuestions, 'target outcomes', targetOutcomes);

    // get the entire Directed Acyclic Graphy that concerns the target outcomes
    // note that this DAG may contain outcomes that didn't show up in the taken results
    let daoData = {entities: allOutcomes, relationships: this.props.relationships};
    let dag = dao.getPathway(_.map(targetOutcomes, 'id'), ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], 'OUTGOING_ALL', daoData);
    console.log('dag', dag);

    let ranked = dao.rankDAG(dag, (item) => dao.getIncomingEntitiesAll(item.id, ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], daoData));
    console.log('ranked', ranked);

    let layout = Xoces.tree.layout(params, ranked, dag.edges);

    layout.links = _.map(layout.links, (link) => {
      return _.assign({}, link, {
        stroke: '#ccc',
        strokeWidth: 1
      })
    });

    console.log('layout', layout);

    return layout;
  }

  onPressIn() {
    console.log('press in');
  }
}

module.exports = TreeView
