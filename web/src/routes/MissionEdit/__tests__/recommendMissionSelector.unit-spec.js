import React          from 'react';
let chai = require('chai');
chai.should();

import { computeRecommendation }      from '../selectors/recommendMissionSelector';
import { data } from './testRecordsData';

describe('the computeRecommendation selector', () => {
  it('returns the original mission goals if no records', () => {
    const student = {
      Identifier: 'guest_32'  // this student has achieved the second goal
    };
    const records = [];
    const mission = {
      goals: [
        '590b5162d17c14593980f6bd',
        '590b5162d17c14593980f6b1'
      ],
      id: 'foo'
    };

    const result = computeRecommendation(student, records, mission);
    result.goals.should.eql(mission.goals);
  });

  it('returns a goal for phase 2 if get even 1 target wrong', () => {
    const student = {
      Identifier: 'guest_97'  // this student has 1 or 2 targets right for first goal
    };
    const records = data;
    const mission = {
      goals: [
        '590b5162d17c14593980f6bd',
        '590b5162d17c14593980f6b1'
      ],
      id: 'foo'
    };

    const result = computeRecommendation(student, records, mission);
    result.goals.should.eql(mission.goals);
  });

  it('returns only the un-achieved goals', () => {
    const student = {
      Identifier: 'guest_32'  // this student has achieved the second goal
    };
    const records = data;
    const mission = {
      goals: [
        '590b5162d17c14593980f6bd',
        '590b5162d17c14593980f6b1'
      ],
      id: 'foo'
    };

    const result = computeRecommendation(student, records, mission);
    result.goals.should.eql(['590b5162d17c14593980f6bd']);
  });

  it('returns all original goals, if no student responses but opened mission', () => {
    const student = {
      Identifier: 'guest_77'  // this student has no answered questions
    };
    const records = data;
    const mission = {
      goals: [
        '590b5162d17c14593980f6bd',
        '590b5162d17c14593980f6b1'
      ],
      id: 'foo'
    };

    const result = computeRecommendation(student, records, mission);
    result.goals.should.eql(mission.goals);
  });

  it('returns all original goals, if student did not open the mission', () => {
    const student = {
      Identifier: 'guest_0'  // this student has no records in data, since
                             //   they didn't open the mission
    };
    const records = data;
    const mission = {
      goals: [
        '590b5162d17c14593980f6bd',
        '590b5162d17c14593980f6b1'
      ],
      id: 'foo'
    };

    const result = computeRecommendation(student, records, mission);
    result.goals.should.eql(mission.goals);
  });
});

// describe('the computeRecommendations selector', () => {
//   beforeEach(() => {
//   });
// });
