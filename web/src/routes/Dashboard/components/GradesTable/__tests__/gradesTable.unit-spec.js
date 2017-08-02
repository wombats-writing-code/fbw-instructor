import React          from 'react';
import { shallow }    from 'enzyme';
let chai = require('chai');
chai.should();

import {missionConfig} from 'fbw-platform-common/reducers/Mission'
import GradesTable    from '../GradesTable';

describe('the GradesTable component', () => {
  let props;
  let result;
  const student = {
    _id: 123
  };

  beforeEach(() => {
    props = {
      mission: {
        displayName: 'test mission 1',
        user: null,
        _id: 321
      },
      missionType: null,
      missions: [
        {
          displayName: 'test mission 1',
          type: missionConfig.PHASE_I_MISSION_TYPE,
          followsFromMissions: [],
          user: null,
          _id: 321
        }, {
          displayName: 'test mission 1 phase 2',
          type: missionConfig.PHASE_II_MISSION_TYPE,
          followsFromMissions: [321],
          user: 123,
          _id: 111
        }
      ]
    };
    result = shallow(<GradesTable {...props} />);
  });

  it('selects phase I when no missionType', () => {
    const studentMission = result.instance()._selectClickedMissionForUser(student);
    studentMission.displayName.should.eql('test mission 1');
    studentMission.should.eql(props.mission);
  });

  it('selects phase II when provided right missionType', () => {
    props.missionType = missionConfig.PHASE_II_MISSION_TYPE;
    result = shallow(<GradesTable {...props} />);
    const studentMission = result.instance()._selectClickedMissionForUser(student);
    studentMission.displayName.should.eql('test mission 1 phase 2');
    studentMission.user.should.eql(student._id);
  });
});
