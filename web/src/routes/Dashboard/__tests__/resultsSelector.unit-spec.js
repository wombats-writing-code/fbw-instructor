import _ from 'lodash';

let chai = require('chai');
const should = chai.should();

import { pointsEarned, filterReviewOutcomes,
  sortRecordsByOutcome, numberAchievedGoals,
  parseGradeForCSV, computeGrades } from '../selectors/resultsSelector'


const RECORDS = require('./mockRecords.json');

describe(`computeGrades`, () => {
  const mission = {
    _id: "5aa2bd5f4ba44700133bd4e3",
    displayName: "Chapter 1 review",
    description: "",
    type: "PHASE_I_MISSION_TYPE",
    startTime: "2018-03-09T07:00:00.000Z",
    deadline: "2018-06-19T04:00:00.000Z",
    course: "5a33e14bf36d28127699c9de",
    user: null,
    leadsToMissionsDeadline: "2018-03-22T04:00:00.000Z",
    leadsToMissionsStartTime: "2018-03-19T04:00:00.000Z",
    followsFromMissions:[],
    leadsToMissions: [],
    id: "5aa2bd5f4ba44700133bd4e3"
  }
  const records = RECORDS;
  const roster = [{
      _id: "5aa2bf9e4ba44700133bd4e4",
      Identifier: "guest1",
      FirstName: "john",
      LastName: "hancock",
      UniqueName: "john hancock14",
    }, {
      _id: "5aa2bfe34ba44700133bd4f3",
      Identifier: "guest2",
      FirstName: "ada",
      LastName: "lovelace",
      UniqueName: "ada lovelace97",
    }, {
      _id: "5aa2c4a24ba44700133bd4ff",
      Identifier: "guest3",
      FirstName: "i",
      LastName: "forgot",
      UniqueName: "i forgot73"}];

  it(`should commpute the grades for each student `, () => {
    let results = computeGrades(mission, records, roster);
    results.length.should.eql(3);
    results[0].user.Identifier.should.eql("guest1");
    results[1].user.Identifier.should.eql("guest2");
    results[2].user.Identifier.should.eql("guest3");
    results[0].goalsAchieved.should.eql("0 / 2");
    results[0].points.should.eql("0 / 4; 0%");
    results[0].numberAttempted.should.eql(2);
  })

  it('should include waypoint calculations', () => {
    let results = computeGrades(mission, records, roster);
    results[0].numberWaypoints.should.eql(10);
    results[0].numberWaypointsAttempted.should.eql(10);
    results[0].numberWaypointsCorrect.should.eql(7);
  })
})

describe('(resultsSelector) pointsEarned', () => {

  it(`should calculate points earned for all correct`, function(done) {
    const questions = [
      {response: {
        isCorrect: true,
      }},
      {response: {
        isCorrect: true,
      }},
      {response: {
        isCorrect: true,
      }},
    ];

    let points = pointsEarned(questions);
    points.should.eql('3 / 3; 100%');

    done();
  });

  it(`should calculate points earned for all wrong`, function(done) {
    const questions = [
      {response: {
        isCorrect: false,
      }},
      {response: {
        isCorrect: false,
      }},
      {response: {
        isCorrect: false,
      }},
    ];

    let points = pointsEarned(questions);
    points.should.eql('0 / 3; 0%');

    done();
  });

  it(`should calculate points earned for none responded`, function(done) {
    const questions = [
      {response: {
        isCorrect: null,
      }},
      {response: {
        isCorrect: null,
      }},
      {response: {
        isCorrect: null,
      }},
    ];

    let points = pointsEarned(questions);
    points.should.eql('0 / 3; 0%');

    done();
  });
})

describe('(resultsSelector) filterReviewOutcomes', () => {

  it(`should return all goals with >50% incorrect`, function(done) {
    const incorrectResponsesByOutcome = {
      '123': [{
        id: 'response1'
      }],
      '234': [{
        id: 'response2'
      }]
    };
    const fractionIncorrectStudentsByOutcome = {
      '123': {
        fractionIncorrect: 1
      },
      '234': {
        fractionIncorrect: 1
      }
    };
    const mission = {
      goals: ['123', '234']
    };

    const result = filterReviewOutcomes(incorrectResponsesByOutcome,
      fractionIncorrectStudentsByOutcome,
      mission);
    result.length.should.eql(2);

    done();
  });

  it('does not return outcomes with fraction incorrect <= 50%', (done) => {
    const incorrectResponsesByOutcome = {
      '123': [{
        id: 'response1'
      }],
      '234': [{
        id: 'response2'
      }]
    };
    const fractionIncorrectStudentsByOutcome = {
      '123': {
        fractionIncorrect: 1
      },
      '234': {
        fractionIncorrect: 0.49
      }
    };
    const mission = {
      goals: ['123', '234']
    };

    const result = filterReviewOutcomes(incorrectResponsesByOutcome,
      fractionIncorrectStudentsByOutcome,
      mission);

    result.length.should.eql(1);
    result[0][0].id.should.eql('response1');

    done();
  });
})

// Moved to @wombats-writing-code/fbw-platform-common
// describe('numberUnansweredTargets selector', () => {
//
//   it(`should calculate 0 targets remaining when all responded`, function(done) {
//     const questions = [
//       {responseResult: true,
//        referenceNumber: '1',
//        id: '1'},
//       {responseResult: true,
//        referenceNumber: '2',
//        id: '2'},
//       {responseResult: true,
//        referenceNumber: '3',
//        id: '3'},
//     ];
//
//     let results = numberUnansweredTargets(questions);
//     results.should.eql(0);
//
//     done();
//   });
//
//   it(`should not calculate unresponded targets`, function(done) {
//     const questions = [
//       {responseResult: true,
//        referenceNumber: '1',
//        id: '1'},
//       {foo: 'bar',
//        referenceNumber: '2',
//        id: '2'},
//       {responseResult: true,
//        referenceNumber: '3',
//        id: '3'},
//     ];
//
//     let results = numberUnansweredTargets(questions);
//     results.should.eql(1);
//
//     done();
//   });
//
//   it(`should not calculate unresponded targets with responded false`, function(done) {
//     // this state should never actually happen?
//     const questions = [
//       {responseResult: true,
//        referenceNumber: '1',
//        id: '1'},
//       {responseResult: false,
//        referenceNumber: '2',
//        id: '2'},
//       {responseResult: true,
//        referenceNumber: '3',
//        id: '3'},
//     ];
//
//     let results = numberUnansweredTargets(questions);
//     results.should.eql(1);
//
//     done();
//   });
//
// })

// Moved to @wombats-writing-code/fbw-platform-common
// describe('numberAttemptedTargets selector', () => {
//
//   it(`should calculate 3 attempted targets when all responded`, function(done) {
//     const questions = [
//       {responseResult: true,
//        referenceNumber: '1',
//        id: '1'},
//       {responseResult: true,
//        referenceNumber: '2',
//        id: '2'},
//       {responseResult: true,
//        referenceNumber: '3',
//        id: '3'},
//     ];
//
//     let results = numberAttemptedTargets(questions);
//     results.should.eql(3);
//
//     done();
//   });
//
//   it(`should not calculate unresponded targets`, function(done) {
//     const questions = [
//       {responseResult: true,
//        referenceNumber: '1',
//        id: '1'},
//       {foo: 'bar',
//        referenceNumber: '2',
//        id: '2'},
//       {responseResult: true,
//        referenceNumber: '3',
//        id: '3'},
//     ];
//
//     let results = numberAttemptedTargets(questions);
//     results.should.eql(2);
//
//     done();
//   });
//
//   it(`should not calculate unresponded targets with responded false`, function(done) {
//     // this state should never actually happen?
//     const questions = [
//       {responseResult: true,
//        referenceNumber: '1',
//        id: '1'},
//       {responseResult: false,
//        referenceNumber: '2',
//        id: '2'},
//       {responseResult: true,
//        referenceNumber: '3',
//        id: '3'},
//     ];
//
//     let results = numberAttemptedTargets(questions);
//     results.should.eql(2);
//
//     done();
//   });
//
// })

describe('sortRecordsByOutcome selector', () => {

  it(`should sort target records by the question outcome`, function(done) {
    const records = [{
      question: {
        outcome: '1'
      }
    }, {
      question: {
        outcome: '2'
      }
    }, {
      question: {
        outcome: '3'
      }
    }, {
      question: {
        outcome: '1'
      }
    }];

    const results = sortRecordsByOutcome(records);
    _.keys(results).length.should.eql(3);
    results['1'].length.should.eql(2);
    results['2'].length.should.eql(1);
    results['3'].length.should.eql(1);

    done();
  });
});

describe('numberAchievedGoals selector', () => {

  it(`should only include correctly responded goals`, function(done) {
    const records = [{
      responseResult: {
        question: {
          response: {
            isCorrect: true
          }
        }
      },
      question: {
        outcome: '1'
      }
    }, {
      responseResult: {
        question: {
          response: {
            isCorrect: true
          }
        }
      },
      question: {
        outcome: '2'
      }
    }, {
      responseResult: {
        question: {
          response: {
            isCorrect: true
          }
        }
      },
      question: {
        outcome: '3'
      }
    }, {
      responseResult: {
        question: {
          response: {
            isCorrect: false
          }
        }
      },
      question: {
        outcome: '1'
      }
    }];

    const results = numberAchievedGoals(records);
    results.should.eql('2 / 3');

    done();
  });
});

describe('parseGradeForCSV selector', () => {

  it(`should throw exception if nothing passed in`, function() {
    should.throw(() => {
      parseGradeForCSV();
    })
  })

  it('should throw exception if grade missing attributes', () => {
    should.throw(() => {
      parseGradeForCSV({
        foo: 'bar'
      })
    })

    should.throw(() => {
      parseGradeForCSV({
        points: '',
        goalsAchieved: '',
        numberWaypoints: 0,
        numberWaypointsCorrect: 0
      })
    })

    should.throw(() => {
      parseGradeForCSV({
        points: '',
        goalsAchieved: '',
        numberWaypoints: 0,
        numberWaypointsAttempted: 0
      })
    })

    should.throw(() => {
      parseGradeForCSV({
        points: '',
        goalsAchieved: '',
        numberWaypointsCorrect: 0,
        numberWaypointsAttempted: 0
      })
    })

    should.throw(() => {
      parseGradeForCSV({
        points: '',
        numberWaypoints: 0,
        numberWaypointsCorrect: 0,
        numberWaypointsAttempted: 0
      })
    })

    should.throw(() => {
      parseGradeForCSV({
        goalsAchieved: '',
        numberWaypoints: 0,
        numberWaypointsCorrect: 0,
        numberWaypointsAttempted: 0
      })
    })
  })

  it('should throw exception is grade missing digits', () => {
    should.throw(() => {
      parseGradeForCSV({
        points: '1',
        goalsAchieved: '1 / 2',
        numberWaypoints: 0,
        numberWaypointsCorrect: 0,
        numberWaypointsAttempted: 0
      })
    })

    should.throw(() => {
      parseGradeForCSV({
        points: '1 / 2',
        goalsAchieved: '1 /',
        numberWaypoints: 0,
        numberWaypointsCorrect: 0,
        numberWaypointsAttempted: 0
      })
    })
  })

  it('should reformat questions', () => {
    let result = parseGradeForCSV({
      points: '1 / 2; 50%',
      goalsAchieved: '3 / 4',
      numberWaypoints: 0,
      numberWaypointsCorrect: 0,
      numberWaypointsAttempted: 0
    })

    result.questionsCorrect.should.eql('1')
    result.totalQuestions.should.eql('2')
  })

  it('should reformat goals', () => {
    let result = parseGradeForCSV({
      points: '1 / 2; 50%',
      goalsAchieved: '3 / 4',
      numberWaypoints: 0,
      numberWaypointsCorrect: 0,
      numberWaypointsAttempted: 0
    })

    result.goalsMastered.should.eql('3')
    result.totalGoals.should.eql('4')
  })

  it('should pass through waypoint numbers', () => {
    let result = parseGradeForCSV({
      points: '1 / 2; 50%',
      goalsAchieved: '3 / 4',
      numberWaypoints: 0,
      numberWaypointsCorrect: 1,
      numberWaypointsAttempted: 2
    })

    result.numberWaypoints.should.eql(0)
    result.numberWaypointsCorrect.should.eql(1)
    result.numberWaypointsAttempted.should.eql(2)
  })
});
