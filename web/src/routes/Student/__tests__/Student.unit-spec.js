import React          from 'react';
import { shallow }    from 'enzyme';
let chai = require('chai');
chai.should();

import { missionConfig } from '@wombats-writing-code/fbw-platform-common/reducers/Mission'

import Student    from '../Student';

describe('the Student component', () => {
  let props;
  let result;
  const student = {
    Identifier: 123
  };

  beforeEach(() => {
    props = {
      mission: {
        displayName: 'test mission 1',
        type: missionConfig.PHASE_I_MISSION_TYPE,
        user: null,
        _id: 321,
        id: 321,
        questions: [{
          _id: 1
        }]
      },
      student: student
    };
    result = shallow(<Student {...props} />);
  });

  it('sends the user prop to MissionContainer', () => {
    result.find({ user: student }).length.should.eql(1);
    result.text().should.not.contain('has not opened their mission yet.');
  });

  it('shows EmptyState if no questions in the mission', () => {
    props.mission.questions = [];
    result = shallow(<Student {...props} />);
    result.find({ user: student }).length.should.eql(0);
    result.text().should.contain('has not opened their mission yet.');
  });

});
