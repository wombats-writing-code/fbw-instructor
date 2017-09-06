let chai = require('chai');
chai.should();

import {pointsEarned, filterReviewOutcomes} from '../selectors/resultsSelector'

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
