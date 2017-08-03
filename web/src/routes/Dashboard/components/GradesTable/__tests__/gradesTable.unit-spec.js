import React          from 'react';
import { shallow, mount }    from 'enzyme';
let chai = require('chai');
chai.should();

import {missionConfig} from 'fbw-platform-common/reducers/Mission'
import GradesTable    from '../GradesTable';
import LaunchPhaseII from '../../LaunchPhaseII';

describe('the GradesTable component', () => {
  let props;
  let result;
  const student = {
    _id: 123
  };
  const mission2 = {
    displayName: 'test mission 2',
    type: missionConfig.PHASE_I_MISSION_TYPE,
    followsFromMissions: [],
    user: null,
    _id: 321
  };

  beforeEach(() => {
    props = {
      mission: {
        displayName: 'test mission 1',
        type: missionConfig.PHASE_I_MISSION_TYPE,
        user: null,
        _id: 321,
        id: 321
      },
      grades: [{
        user: {
          id: 123
        }
      }],
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
        }, mission2
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

  it('shows active launch button when user\'s linked phase II does not exist', () => {
    props.mission = mission2;
    result = mount(<GradesTable {...props} />);
    result.find(LaunchPhaseII).first().html().should.not.contain('disabled=""');
  });

  it('shows disabled "launched" button when user\' linked phase II does exist', () => {
    result.find(LaunchPhaseII).first().html().should.contain('disabled=""');
  });
});
