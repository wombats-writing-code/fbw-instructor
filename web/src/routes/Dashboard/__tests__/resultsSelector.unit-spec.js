import _ from 'lodash';

let chai = require('chai');
chai.should();

import { pointsEarned, filterReviewOutcomes,
  numberUnansweredTargets, numberAttemptedTargets,
  sortRecordsByOutcome, numberAchievedGoals } from '../selectors/resultsSelector'

// describe(`computeGrades`, () => {
//   it(`should commpute the grades for a single student `)
// })

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
