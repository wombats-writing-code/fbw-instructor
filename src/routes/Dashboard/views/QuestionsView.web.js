// Questions View for mission results
// Should take a list of responses
//  [
//    {
//      displayName, description, id, etc.
//      questions: [
//        itemId:  < use this field to match across students >
//        text.text: < show this as a preview to faculty >
//        responses: [ <null> or { isCorrect: state,
//                                 submissionTime: ISO time string }]  < may have to sort by submissionTime? >
//        learningObjectiveIds: [ < use this for outcomes view > ]
//      ]
//    }
// ]
// and organize them by question itemId, keeping count of how many
// students got them right in X attempts
//
// Two input parameters:
//   1) results
//   2) selector value

'use strict';
import React, {Component} from 'react';
import 'lodash'

import BASE_STYLES from '../../../styles/baseStyles'
import EmptyState from '../../../components/EmptyState'
let styles = {
  container: {
    display: 'flex'
  },
  directiveCollection: {
    marginLeft: 0,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    borderLeftStyle: 'solid',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    borderRightStyle: 'solid',
    minWidth: '25%',
    flex: 1,
    flexGrow: 0
  },
  questionCollection: {
    marginLeft: 0,
    paddingLeft: '1em',
    flex: 3
  },
  directiveItem: {
    paddingTop: '.725rem',
    paddingLeft: '1em',
    paddingRight: '1em',
    paddingBottom: '.9rem',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'solid',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#f8f8f8'
    }
  },
  directiveItemSelected: {
    backgroundColor: '#f8f8f8',
    cursor: 'default'
  },
  directiveItemLast: {
    borderBottomColor: 'transparent',
  },
  directiveText: {
    color: '#333',
    fontSize: '.875rem',
    lineHeight: 1.25,
    marginBottom: 0,
    textAlign: 'left'
  },
  resultItem: {
    display: 'flex',
  },
  questionText: {
    textAlign: 'left',
    overflow: 'hidden',
    marginBottom: '1.625rem',
    fontSize: '.875rem',
    width: '75%',
    flex: 4
  },
  warning: {
    color: BASE_STYLES.warningColor,
    fontWeight: '600'
  },
  muted: {
    color: '#888'
  },
  resultInfoTotal: {
    color: '#666',
    fontWeight: '600'
  },
  resultInfo: {
    marginLeft: '1em',
    fontSize: '1.25rem',
    flex: 1
  }
}


const createMarkup = (htmlString) => {
  return {__html: htmlString};
}

export const QuestionsViewWeb = (props) => {

  let viewData = props.questionsViewData;

  if (!props.viewState || !viewData || !viewData.resultsByDirective) {
    return (
      <div className="columns">
        { EmptyState('There are no results yet. Try refreshing or waiting for a student to try a question.')}
      </div>
    )
  }

  let currentDirectiveId = props.viewState.currentDirective ? props.viewState.currentDirective.id : null;
  let questionCollection;
  if (currentDirectiveId) {
    let collection = viewData.resultsByDirective[currentDirectiveId];
    // console.log('currentDirectiveId', currentDirectiveId, 'resultsByDirective', viewData.resultsByDirective, 'resultsByDirective', collection);

    questionCollection = (
      <ul style={styles.questionCollection}>
        {_.map(collection, (result, idx) => {
            return (
              <div key={`question_${idx}`} style={[styles.resultItem]}>
                <div style={styles.questionText} dangerouslySetInnerHTML={createMarkup(result.questionText)}></div>
                <div style={styles.resultInfo}>
                  <span style={styles.warning}>{result.numStudentsNotAchieved}</span> &nbsp;
                  <span style={styles.muted}>of</span> &nbsp;
                  <span style={styles.resultInfoTotal}>{result.numStudentsAttempted}</span>
                </div>
              </div>
            )
        })}
      </ul>
    )
  }


  return (
    <div style={styles.container}>
      <ul style={styles.directiveCollection} className="clearfix">
        {_.map(viewData.directives, (outcome, idx) => {
            let lastItemStyle = idx === viewData.directives.length-1 ? styles.directiveItemLast : null
            return (
              <div key={`outcome_${idx}`}
                  style={[styles.directiveItem, props.viewState.currentDirective === outcome ? styles.directiveItemSelected : null, lastItemStyle]}
                  onClick={(e) => props.onClickDirective(outcome, 'dashboard.questionsView')}>
                <p style={styles.directiveText}>{outcome.displayName.text}</p>
              </div>
            )
        })}
      </ul>

      {questionCollection}

    </div>

  )

  // renderRow = (questionWithComputed) => {
  //
  //   if (questionWithComputed.numStudentsDidNotAchieve === 0) {
  //     return null;
  //   }
  //
  //   let questionTypeIcon;
  //   if (isTarget(questionWithComputed)) {
  //     questionTypeIcon = <Image style={styles.questionTypeIcon} source={require('../../../assets/target-question.png')} />
  //   } else {
  //     questionTypeIcon = <Image style={styles.questionTypeIcon} source={require('../../../assets/waypoint-question.png')} />
  //   }
  //
  //
  //   let studentResponseButtonVerb = 'See',
  //     studentResponses;
  //
  //   if (this.state.expandedStudentResponses.indexOf(questionWithComputed.id) >= 0) {
  //     let headerRow = [];
  //     studentResponseButtonVerb = 'Hide';
  //
  //     for (var i=1; i<=this.props.maxAttempts; i++) {
  //       if (i == 1) {
  //         headerRow.push('1st');
  //       } else if (i == 2) {
  //         headerRow.push('2nd');
  //       } else if (i == 3) {
  //         headerRow.push('3rd');
  //       } else {
  //         headerRow.push('4th');
  //       }
  //     }
  //
  //     let rowLabels = _.map(questionWithComputed.choices, 'text');
  //     // let's create a table that shows choices as rows, versus # attempts
  //     // as columns, up to this.props.maxAttempts
  //     //
  //     //                      1st   2nd   3rd   4th
  //     //  $4000 +              0     0     0     0  Should correct answer show #'s as well?
  //     //  $1200 X             10     4     2     0
  //     //  $6000 X              2     0     0     0
  //     //  $0    X              5     1     0     0
  //     //  Showed answer        1     0     0     0
  //
  //     // for debugging
  //     // notCorrectWithinAttempts(questionWithComputed.itemId, this.props.takenResults, this.props.maxAttempts);
  //
  //     let surrenderData = selectedChoiceXWithinAttempts(this.props.takenResults,
  //       questionWithComputed.choices[0].id,
  //       this.props.maxAttempts,
  //       true);
  //     studentResponses = (
  //       <View style={styles.studentResponseBlock}>
  //         <View style={styles.studentResponseRow}>
  //           <View style={styles.rowLabelColumn}></View>
  //           {_.map(headerRow, (label, index) => {return <View key={index} style={styles.attemptsColumnWrapper}><Text>{label}</Text></View>})}
  //         </View>
  //         {_.map(_.orderBy(questionWithComputed.choices, 'name'), this.renderStudentResponseMatrix)}
  //         <View style={styles.studentResponseRow}>
  //           <View style={[styles.rowLabelColumn, styles.showedAnswerColumn]}><Text>Showed Answer</Text></View>
  //           {_.map(surrenderData, (label, index) => {return <View key={index} style={styles.attemptsColumnWrapper}><Text>{label}</Text></View>})}
  //         </View>
  //       </View>
  //     );
  //   }
  //
  //   return (
  //     <View style={styles.row}>
  //       <View style={styles.questionWrapper}>
  //         {questionTypeIcon}
  //         <View style={styles.questionTextWrapper}>
  //           <MathWebView content={questionWithComputed.text.text} />
  //         </View>
  //         <View style={styles.attemptsTextWrapper}>
  //           <Text style={styles.numStudentsDidNotAchieve}>{questionWithComputed.numStudentsDidNotAchieve}</Text>
  //         </View>
  //       </View>
  //
  //       <View style={styles.controls}>
  //         <TouchableHighlight style={styles.getAnotherQuestionButton} onPress={_.noop} >
  //           <Text style={styles.getAnotherQuestionButtonText}>Get another question</Text>
  //         </TouchableHighlight>
  //         <TouchableHighlight style={styles.seeStudentResponsesButton} onPress={() => this.toggleStudentResponseState(questionWithComputed.id)} >
  //           <Text style={styles.seeStudentResponsesButtonText}>{studentResponseButtonVerb} student responses</Text>
  //         </TouchableHighlight>
  //       </View>
  //       {studentResponses}
  //     </View>
  //   )
  // }
  //
  // renderStudentResponseMatrix = (rowData) => {
  //   // to calculate how many students fall into each bin, need to inspect this.props.takenResults
  //   // and see how many answers match this rowData.id
  //   let attemptsData = selectedChoiceXWithinAttempts(this.props.takenResults,
  //     rowData.id,
  //     this.props.maxAttempts,
  //     false);
  //   return (<View key={rowData.id} style={styles.studentResponseRow}>
  //     <View style={styles.rowLabelColumn}>
  //       <MathWebView content={rowData.text} />
  //     </View>
  //     {_.map(attemptsData, (label, index) => {return <View key={index} style={styles.attemptsColumnWrapper}><Text>{label}</Text></View>})}
  //   </View>);
  // }
  //
  // toggleStudentResponseState = (questionId) => {
  //   if (this.state.expandedStudentResponses.indexOf(questionId) < 0) {
  //     this.setState({ expandedStudentResponses: _.concat(this.state.expandedStudentResponses, questionId)});
  //   } else {
  //     this.setState({ expandedStudentResponses: _.filter(this.state.expandedStudentResponses, (qId) => {
  //       return qId !== questionId;
  //     })});
  //   }
  // }
  //
  // render() {
  //   let questionsList = uniqueQuestions(this.props.takenResults);
  //   let questionsWithComputed = _.orderBy(_.map(questionsList, (question) => {
  //     let didNotAchieveTakens = notCorrectWithinAttempts(question.itemId, this.props.takenResults, this.props.maxAttempts);
  //     if (this.props.maxAttempts == 2) {
  //       console.log('introspecting maxAttempts 2');
  //       console.log(didNotAchieveTakens);
  //       _.each(didNotAchieveTakens, (taken) => {
  //         console.log(grabAndSortResponses(taken.questions, question.itemId));
  //       });
  //     }
  //     return _.assign({}, question, {
  //       numStudentsDidNotAchieve: didNotAchieveTakens.length
  //     })
  //   }), ['numStudentsDidNotAchieve'], ['desc']);
  //
  //
  //   //console.log('taken results', this.props.takenResults);
  //   //console.log('questionsWithComputed', questionsWithComputed);
  //   // console.log('questionsList', questionsList)
  //
  //   return (
  //     <ListView dataSource={this.state.ds.cloneWithRows(questionsWithComputed)}
  //               renderRow={this.renderRow}>
  //     </ListView>
  //   );
  // }
  //

}
