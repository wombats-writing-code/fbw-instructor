import React          from 'react';
import { shallow, mount }    from 'enzyme';
let chai = require('chai');
let should = chai.should();
import ReactTable from 'react-table'

import {missionConfig} from '@wombats-writing-code/fbw-platform-common/reducers/Mission'
import EditPhaseIIDates    from '../EditPhaseIIDates';

describe('the EditPhaseIIDates component', () => {
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
    _id: 432123,
    id: 432123
  };
  const mission1 = {
    displayName: 'test mission 1',
    type: missionConfig.PHASE_I_MISSION_TYPE,
    user: null,
    _id: 321,
    id: 321,
    questions: []
  }

  beforeEach(() => {
    props = {
      mission: mission1,
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
          _id: 111,
          id: 111
        }, mission2
      ]
    };
    result = shallow(<EditPhaseIIDates {...props} />);
  });

  it('should not update any missions if no phase 2', () => {
    props.mission = mission2;

    props.onSave = (missions) => {
      missions.length.should.eql(0);
    }

    result = shallow(<EditPhaseIIDates {...props} />);
    result.instance()._onSave();
  });

  it('should only send linked phase 2s', () => {
    props.onSave = (missions) => {
      missions.length.should.eql(1);
      missions[0].id.should.eql(111);
    }
    result = mount(<EditPhaseIIDates {...props} />);
    result.instance()._onSave();
  });

  it('should update linked phase 2 dates', () => {
    props.mission.startTime = 123;
    props.mission.deadline = 321;
    props.onSave = (missions) => {
      missions.length.should.eql(1);
      missions[0].id.should.eql(111);
      missions[0].startTime.should.eql(123);
      missions[0].deadline.should.eql(321);
    }
    result = mount(<EditPhaseIIDates {...props} />);
    result.instance()._onSave();
  });
});
