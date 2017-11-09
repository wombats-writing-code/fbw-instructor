import React          from 'react';
import { shallow, mount }    from 'enzyme';
let chai = require('chai');
let should = chai.should();

import {missionConfig} from '@wombats-writing-code/fbw-platform-common/reducers/Mission'
import MissionResult    from '../MissionResult';

describe('the MissionResult component', () => {
  let props;
  let result;

  beforeEach(() => {
    props = {
      currentMission: {
        displayName: 'test mission 1',
        type: missionConfig.PHASE_I_MISSION_TYPE,
        user: null,
        _id: 321,
        id: 321,
        questions: []
      },
      currentCourse: null,
      records: [
        {
          mission: 321,
          user: 'foo'
        }, {
          mission: 321,
          user: 'foo'
        }
      ],
      user: {
        Identifier: 'foo',
        DisplayName: 'Jane Doe'
      }
    };
    result = shallow(<MissionResult {...props} />);
  });

  it('should send props user when calling onCreateMissions', (done) => {
    props.onCreateMissions = (missions, course, user) => {
      user.Identifier.should.eql('foo');
      done();
    }

    result = shallow(<MissionResult {...props} />);
    result.instance()._onClickCreateMission({
      Identifier: 'bar',
      DisplayName: 'gain'
    });
  });

});
