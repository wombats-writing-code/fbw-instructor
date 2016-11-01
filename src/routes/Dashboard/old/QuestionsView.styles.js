
import {
  StyleSheet
} from 'react-native';

module.exports = StyleSheet.create({
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
  row: {
    margin: 10,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  questionWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  questionTextWrapper: {
    flex: 5
  },
  attemptsTextWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },

  questionTypeIcon: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  numStudentsDidNotAchieve: {
    fontSize: 20,
    color: '#FF6F69'
  },

  controls: {
    flexDirection: 'row',
    marginBottom: 18,
    marginLeft: 48,
    justifyContent: 'space-between'
  },
  getAnotherQuestionButton: {
    padding: 9,
    backgroundColor: '#2980B9',
    borderRadius: 3,
  },
  getAnotherQuestionButtonText: {
    color: '#fff'
  },
  seeStudentResponsesButton: {
    padding: 9,
    backgroundColor: '#FF6F69',
    borderRadius: 3,
  },
  seeStudentResponsesButtonText: {
    color: '#fff'
  },
  studentResponseBlock: {
    marginBottom: 18,
    marginLeft: 98,
    marginRight: 98,
    justifyContent: 'space-between'
  },
  studentResponseRow: {
    flex: 1,
    flexDirection: 'row'
  },
  rowLabelColumn: {
    flex: 9
  },
  attemptsColumnWrapper: {
    flex: 1,
    paddingTop: 8,
    alignItems: 'center'
  },
  showedAnswerColumn: {
    paddingLeft: 8,
    paddingTop: 8
  }
});
