import React          from 'react';
import { shallow, mount }    from 'enzyme';
let chai = require('chai');
let should = chai.should();
import ReactTable from 'react-table'

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
    _id: 4321
  };
  const mission2Phase2 = {
    displayName: 'test mission 2 Phase 2',
    type: missionConfig.PHASE_II_MISSION_TYPE,
    followsFromMissions: [4321],
    user: 123,
    _id: 432123
  };

  beforeEach(() => {
    props = {
      mission: {
        displayName: 'test mission 1',
        type: missionConfig.PHASE_I_MISSION_TYPE,
        user: null,
        _id: 321,
        id: 321,
        questions: []
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
    props.grades = [{
      user: {
        id: 123
      }
    }];
    result = mount(<GradesTable {...props} />);
    result.find(LaunchPhaseII).first().html().should.not.contain('disabled=""');
  });

  it('shows disabled "launched" button when user\' linked phase II does exist', () => {
    props.grades = [{
      user: {
        id: 123
      }
    }];
    result = mount(<GradesTable {...props} />);
    result.find(LaunchPhaseII).first().html().should.contain('disabled=""');
  });

  it('returns null when has no grades', () => {
    props.grades = [];
    result = mount(<GradesTable {...props} />);
    // this used to throw a TypeError when grades === [], so just
    //   being able to render is a plus
    should.not.exist(result.html());
  });

  it('returns null when grades is null', () => {
    result = mount(<GradesTable {...props} />);
    // this used to throw a TypeError when grades === [], so just
    //   being able to render is a plus
    should.not.exist(result.html());
  });

  it('returns a phase I with no questions, when student has no phase II', () => {
    props.missionType = missionConfig.PHASE_II_MISSION_TYPE;
    result = shallow(<GradesTable {...props} />);
    const studentMission = result.instance()._selectClickedMissionForUser({
      _id: 45
    });
    studentMission.displayName.should.eql('test mission 1');
    should.not.exist(studentMission.questions);
  });

  it('launches the right edit phase 2 modal when multiple phase 2s in props.missions', () => {
    props.missions.push(mission2Phase2);
    props.mission = mission2;
    result = shallow(<GradesTable {...props} />);
    const phase2Edit = result.instance()._findMissionForUser(student);
    phase2Edit.should.eql(mission2Phase2);
  });
});
