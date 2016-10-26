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
import React, {
    Component,
} from 'react';

import {
  Animated,
  View,
  TouchableHighlight,
  ListView,
  StyleSheet,
  Text,
  WebView
} from 'react-native';

let _ = require('lodash');
var moment = require('moment');

var credentials = require('../../../constants/credentials');
var MathJaxURL = credentials.MathJaxURL;
var MathWebView = require('../../math-webview/MathWebView');

let styles = StyleSheet.create({
  notification: {
    backgroundColor: '#ff9c9c',
    padding: 3
  },
  notificationText: {
    fontSize: 10,
    padding: 5
  },
  progressIcon: {
    marginRight: 3
  },
  rounded: {
    borderRadius: 3
  },
  questionRow: {
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    padding: 5
  },
  questionTextWrapper: {
    flex: 5
  },
  attemptsTextWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  }
});

class QuestionsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }
  }

  renderRow = (rowData) => {
    return (
      <View style={styles.questionRow}>
        <View style={styles.questionTextWrapper}>
          <MathWebView content={rowData.text} />
        </View>
        <View style={styles.attemptsTextWrapper}>
          <Text style={styles.attemptNumber}>
            {rowData.numberStudentsByAttempt} of {rowData.numberStudentsWhoSawThisItem}
          </Text>
        </View>
      </View>
    )
  }

  submissionTime = (responseA, responseB) => {
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

  render() {
    let sortedQuestions = [],
      itemsByStudentAndResponses = {},
      itemsByStudentWithAttemptsCounter = {},
      // separate dict to store questions a student got right, finally, otherwise we have no way of
      // knowing if the student attempts == number of views and they never got it right,
      // or if they got it right on their last attempt...
      studentQuestionsCorrect = {},
      questionTexts = {},
      selectorValue = this.props.attemptsSelector ? this.props.attemptsSelector : 1,
      _this = this,
      questions;

    // first, organize all responses by timestamp and itemId
    _.each(this.props.results, (taken) => {
      let studentId = taken.takingAgentId;

      _.each(taken.questions, (question) => {
        let itemId = question.itemId;
        questionTexts[itemId] = question.text.text;

        if (_.keys(itemsByStudentAndResponses).indexOf(itemId) < 0) {
          itemsByStudentAndResponses[itemId] = {};
        }
        if (_.keys(itemsByStudentAndResponses[itemId]).indexOf(studentId) < 0) {
          itemsByStudentAndResponses[itemId][studentId] = [];  // list of responses; will need to sort by time
        }

        _.each(question.responses, (response) => {
          itemsByStudentAndResponses[itemId][studentId].push(response);
        })
      });
    });
    // itemsByStudentAndResponses should now look like:
    //  {
    //    "assessment.Item": {
    //      "student1": [response1, response2, response3],
    //      "student2": [response5, response1, response4]
    //    }
    //
    //
    //  }

    _.each(itemsByStudentAndResponses, (studentData, itemId) => {
      _.each(studentData, (responses, studentId) => {
        responses = _.orderBy(_this.submissionTime);
      });
    });

    // itemsByStudentAndResponses should now look like:
    //  {
    //    "assessment.Item": {
    //      "student1": [response1, response2, response3],
    //      "student2": [response1, response2, response3, ...]
    //    }
    //
    //
    //  }

    // now let's count how many responses each student has before
    // getting it correct
    _.each(itemsByStudentAndResponses, (studentData, itemId) => {
      if (_.keys(itemsByStudentWithAttemptsCounter).indexOf(itemId) < 0) {
        itemsByStudentWithAttemptsCounter[itemId] = {};
      }
      _.each(studentData, (responses, studentId) => {
        if (_.keys(itemsByStudentWithAttemptsCounter[itemId]).indexOf(studentId) < 0) {
          itemsByStudentWithAttemptsCounter[itemId][studentId] = 0;
        }

        _.each(responses, (response) => {
          let studentAlreadyGotItemCorrect = false;

          if (_.keys(studentQuestionsCorrect).indexOf(studentId) >= 0) {
            if (studentQuestionsCorrect[studentId].indexOf(itemId) >= 0) {
              studentAlreadyGotItemCorrect = true;
            }
          }

          if (!studentAlreadyGotItemCorrect) {
            if (!response) { // null
              itemsByStudentWithAttemptsCounter[itemId][studentId]++;
            } else if (_.keys(response).indexOf('missingResponse') >= 0) {
              // no response counts as wrong
              itemsByStudentWithAttemptsCounter[itemId][studentId]++;
            } else if (!response.isCorrect) {
              itemsByStudentWithAttemptsCounter[itemId][studentId]++;
            } else if (response.isCorrect) {
              if (_.keys(studentQuestionsCorrect).indexOf(studentId) < 0) {
                studentQuestionsCorrect[studentId] = [];
              }
              studentQuestionsCorrect[studentId].push(itemId);
            }
          }
        });
      })
    })
    // now let's count stuff for each item and put into an array
    // now map sortedQuestions into an array for ListView
    _.each(itemsByStudentWithAttemptsCounter, (studentData, itemId) => {
      let numberStudentsWhoSawThisItem = _.keys(studentData).length;
      let numberStudentsCorrectByAttempt = 0;

      _.each(studentData, (studentAttempts, studentId) => {
        // only add these attempts if the student actually got the
        // question correct ...
        if (_.keys(studentQuestionsCorrect).indexOf(studentId) >= 0) {
          if (studentQuestionsCorrect[studentId].indexOf(itemId) >= 0) {
            // do < here instead of <= because the counter above
            // only counts wrong attempts BEFORE you get it right ...
            // so if the view is showing # students who the question
            // right in <= 1 attempt, for example, we only take counter == 0
            // cases here.
            if (studentAttempts < selectorValue) {
              numberStudentsCorrectByAttempt++;
            }
          }
        }
      })

      sortedQuestions.push({
        itemId: itemId,
        text: questionTexts[itemId],
        numberStudentsByAttempt: numberStudentsCorrectByAttempt,
        numberStudentsWhoSawThisItem: numberStudentsWhoSawThisItem
      })
    });

    console.log(studentQuestionsCorrect)
    console.log(itemsByStudentWithAttemptsCounter)
    console.log(itemsByStudentAndResponses)

    // sort in descending order by # of students?
    sortedQuestions = _.reverse(_.sortBy(sortedQuestions, ['numberStudentsByAttempt', 'numberStudentsWhoSawThisItem', 'text']));

    questions = sortedQuestions.length > 0 ?
              ( <ListView
                    dataSource={this.state.ds.cloneWithRows(sortedQuestions)}
                    renderRow={this.renderRow}>
                </ListView> ) :
              ( <View style={[styles.notification, styles.rounded]} >
                <Text style={styles.notificationText}>
                  No questions in this mission.
                </Text>
              </View> );

    return (
      <View>
        {questions}
      </View>
    );
  }

  _wrapHTMLWithMathjax = (markup) => {
    return `<!DOCTYPE html>
      <html>
        <head>
          <script src="${MathJaxURL}"></script>
        </head>
        <body>
          ${markup}
        </body>
      </html>`;
  }
}

module.exports = QuestionsView
