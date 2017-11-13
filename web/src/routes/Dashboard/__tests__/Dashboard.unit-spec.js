import React from 'react'
import moment from 'moment'
import Dashboard from '../Dashboard'
import { shallow } from 'enzyme'
import { missionConfig } from '@wombats-writing-code/fbw-platform-common/reducers/Mission'

import '../../../styles/foundation.min.css'
import '../../../styles/core.scss'
import '../../../styles/animations.scss'

let chai = require('chai')
let should = chai.should()

const PHASE_I_MISSION_NOT_LAUNCHED_WITH_DEADLINE_SET = {
  displayName: 'phase 1',
  leadsToMissions: [],
  leadsToMissionsDeadline: moment().add(7, 'd'),
  type: missionConfig.PHASE_I_MISSION_TYPE,
  id: '1',
  goals: ['1', '2', '3']
}

const PHASE_I_MISSION_NOT_LAUNCHED_WITH_START_TIME_SET = {
  displayName: 'phase 1',
  leadsToMissions: [],
  leadsToMissionsStartTime: moment().add(7, 'd'),
  type: missionConfig.PHASE_I_MISSION_TYPE,
  id: '1',
  goals: ['1', '2', '3']
}

const PHASE_I_MISSION_NOT_LAUNCHED_WITH_BOTH_DATES_SET = {
  displayName: 'phase 1',
  leadsToMissions: [],
  leadsToMissionsDeadline: moment().add(14, 'd'),
  leadsToMissionsStartTime: moment().add(7, 'd'),
  type: missionConfig.PHASE_I_MISSION_TYPE,
  id: '1',
  goals: ['1', '2', '3']
}

const PHASE_I_MISSION_NOT_LAUNCHED_NO_DATES = {
  displayName: 'phase 1',
  leadsToMissions: [],
  type: missionConfig.PHASE_I_MISSION_TYPE,
  id: '2'
}

const PHASE_I_MISSION_LAUNCHED = {
  displayName: 'phase 1',
  leadsToMissions: ['123'],
  type: missionConfig.PHASE_I_MISSION_TYPE,
  id: '3'
}

const PHASE_II_MISSION = {
  displayName: 'phase 2',
  leadsToMissions: [],
  type: missionConfig.PHASE_II_MISSION_TYPE,
  id: '4'
}


function stampUserRecord (id) {
  return {
    user: {
      Identifier: id
    },
    sectionIndex: 0
  }
}


describe('Dashboard', () => {
  let props;
  let functionCalled;

  beforeEach( () => {
    functionCalled = false
    props = {
      isCreateMissionInProgress: false,
      isGetMissionsInProgress: false,
      isGetResultsInProgress: false,
      onResetDashboardMission: () => {

      },
      onClickRefreshResults: () => {

      },
      onCreateMissions: () => {
        functionCalled = true
      },
      resultsByMission: {
        '1': [{}],
        '2': [{}],
        '3': [{}],
        '4': [{}],
        '5': []
      },
      user: {},
      editView: ''
    }
  })

  it('should enable bulk launch phase 2 button if no phase 2 missions exist', () => {
    props.mission = PHASE_I_MISSION_NOT_LAUNCHED_WITH_BOTH_DATES_SET

    const dashboard = shallow(
      <Dashboard {...props} />
    )

    dashboard.find('.dashboard__launch-mission-bulk-button').length.should.be.eql(1)
    dashboard.find('.dashboard__launch-mission-bulk-button-disabled').length.should.be.eql(0)
  })

  it('should not enable bulk launch phase 2 button if no leadsToMissionsDeadline set', () => {
    props.mission = PHASE_I_MISSION_NOT_LAUNCHED_WITH_START_TIME_SET

    const dashboard = shallow(
      <Dashboard {...props} />
    )

    dashboard.find('.dashboard__launch-mission-bulk-button').length.should.be.eql(0)
    dashboard.find('.dashboard__launch-mission-bulk-button-disabled').length.should.be.eql(1)
  })

  it('should not enable bulk launch phase 2 button if no leadsToMissionsStartTime set', () => {
    props.mission = PHASE_I_MISSION_NOT_LAUNCHED_WITH_DEADLINE_SET

    const dashboard = shallow(
      <Dashboard {...props} />
    )

    dashboard.find('.dashboard__launch-mission-bulk-button').length.should.be.eql(0)
    dashboard.find('.dashboard__launch-mission-bulk-button-disabled').length.should.be.eql(1)
  })

  it('should not enable bulk launch phase 2 button if no phase 2 dates set', () => {
    props.mission = PHASE_I_MISSION_NOT_LAUNCHED_NO_DATES

    const dashboard = shallow(
      <Dashboard {...props} />
    )

    dashboard.find('.dashboard__launch-mission-bulk-button').length.should.be.eql(0)
    dashboard.find('.dashboard__launch-mission-bulk-button-disabled').length.should.be.eql(1)
  })

  it('should not enable bulk launch phase 2 button if phase 2 missions exist', () => {
    props.mission = PHASE_I_MISSION_LAUNCHED

    const dashboard = shallow(
      <Dashboard {...props} />
    )

    dashboard.find('.dashboard__launch-mission-bulk-button').length.should.be.eql(0)
    dashboard.find('.dashboard__launch-mission-bulk-button-disabled').length.should.be.eql(1)
  })

  it('should not enable bulk launch phase 2 button for phase 2 mission', () => {
    // this state should never happen, but it's part of the logic...
    props.mission = PHASE_II_MISSION

    const dashboard = shallow(
      <Dashboard {...props} />
    )

    dashboard.find('.dashboard__launch-mission-bulk-button').length.should.be.eql(0)
    dashboard.find('.dashboard__launch-mission-bulk-button-disabled').length.should.be.eql(1)
  })

  it('should not enable bulk launch phase 2 button when no phase 1 records', () => {
    props.mission = {
      displayName: 'phase 1',
      leadsToMissions: [],
      leadsToMissionsDeadline: moment().add(14, 'd'),
      leadsToMissionsStartTime: moment().add(7, 'd'),
      type: missionConfig.PHASE_I_MISSION_TYPE,
      id: '5',  // in resultsByMission but no records -- should not happen.
      goals: ['1', '2', '3']
    }

    let dashboard = shallow(
      <Dashboard {...props} />
    )

    dashboard.find('.dashboard__launch-mission-bulk-button').length.should.be.eql(0)
    dashboard.find('.dashboard__launch-mission-bulk-button-disabled').length.should.be.eql(1)

    props.mission = {
      displayName: 'phase 1',
      leadsToMissions: [],
      leadsToMissionsDeadline: moment().add(14, 'd'),
      leadsToMissionsStartTime: moment().add(7, 'd'),
      type: missionConfig.PHASE_I_MISSION_TYPE,
      id: '6',  // not in resultsByMission
      goals: ['1', '2', '3']
    }

    dashboard = shallow(
      <Dashboard {...props} />
    )

    dashboard.find('.dashboard__launch-mission-bulk-button').length.should.be.eql(0)
    dashboard.find('.dashboard__launch-mission-bulk-button-disabled').length.should.be.eql(1)
  })

  it('should not render the Edit All Phase IIs button if no phase II missions', () => {
    props.mission = PHASE_I_MISSION_NOT_LAUNCHED_WITH_DEADLINE_SET

    const dashboard = shallow(
      <Dashboard {...props} />
    )

    dashboard.find('.dashboard__launch-mission-edit-phase-ii-button').length.should.be.eql(0)
  })

  it('should render the Edit All Phase IIs button if phase II missions', () => {
    props.mission = PHASE_I_MISSION_LAUNCHED

    const dashboard = shallow(
      <Dashboard {...props} />
    )

    dashboard.find('.dashboard__launch-mission-edit-phase-ii-button').length.should.be.eql(1)
  })

  it('_onCreateMissionsForStudents should throw exception if no deadline for phase 2 set', () => {
    props.mission = PHASE_I_MISSION_NOT_LAUNCHED_WITH_START_TIME_SET

    const dashboard = shallow(
      <Dashboard {...props} />
    )

    should.throw(() => {
      dashboard.instance()._onCreateMissionsForStudents([])
    })
  })

  it('_onCreateMissionsForStudents should throw exception if no start time for phase 2 set', () => {
    props.mission = PHASE_I_MISSION_NOT_LAUNCHED_WITH_DEADLINE_SET

    const dashboard = shallow(
      <Dashboard {...props} />
    )

    should.throw(() => {
      dashboard.instance()._onCreateMissionsForStudents([])
    })
  })

  it('should pass along unique list of students when calling _onCreateMissions', () => {
    props.mission = PHASE_I_MISSION_NOT_LAUNCHED_WITH_BOTH_DATES_SET
    props.resultsByMission = {
      '1': [stampUserRecord('123'),
        stampUserRecord('234'),
        stampUserRecord('123'),
        stampUserRecord('234'),
        stampUserRecord('345')],
      '2': [stampUserRecord('321')]
    }

    const dashboard = shallow(
      <Dashboard {...props} />
    )

    dashboard.instance()._onCreateMissionsForStudents = (students) => {
      students.length.should.eql(3)
      students[0].Identifier.should.eql('123')
      students[1].Identifier.should.eql('234')
      students[2].Identifier.should.eql('345')
    }

    dashboard.instance()._onCreateMissions()
  })

  it('should call props.onCreateMissions when calling _onCreateMissionsForStudents', () => {
    props.mission = PHASE_I_MISSION_NOT_LAUNCHED_WITH_BOTH_DATES_SET
    props.resultsByMission = {
      '1': [stampUserRecord('123'),
        stampUserRecord('234'),
        stampUserRecord('123'),
        stampUserRecord('234'),
        stampUserRecord('345')],
      '2': [stampUserRecord('321')]
    }

    const dashboard = shallow(
      <Dashboard {...props} />
    )

    functionCalled.should.eql(false)
    dashboard.instance()._onCreateMissionsForStudents(['123', '234', '345'])
    functionCalled.should.eql(true)
  })

  it('_onCreateMissionsForStudents should pass all args to props.onCreateMissions', () => {
    props.mission = PHASE_I_MISSION_NOT_LAUNCHED_WITH_BOTH_DATES_SET
    props.resultsByMission = {
      '1': [stampUserRecord('123'),
        stampUserRecord('234'),
        stampUserRecord('123'),
        stampUserRecord('234'),
        stampUserRecord('345')],
      '2': [stampUserRecord('321')]
    }
    props.currentCourse = {
      id: 'foo'
    }
    props.user = {
      Identifier: 'me'
    }
    props.onCreateMissions = (missions, course, user) => {
      missions.length.should.eql(3)
      missions[0].userId.should.eql('123')
      missions[1].userId.should.eql('234')
      missions[2].userId.should.eql('345')
      course.should.eql(props.currentCourse)
      user.should.eql(props.user)  // should use logged in user, not student
    }

    const dashboard = shallow(
      <Dashboard {...props} />
    )

    dashboard.instance()._onCreateMissionsForStudents([{
      Identifier: '123'
    }, {
      Identifier: '234'
    }, {
      Identifier: '345'
    }])
  })

  it('_onCreateMissionsForStudents can create phase 2 for student who did not take phase 1', () => {
    // This is called from MissionResult, where the instructor has
    //   individual student-level control, so we need to make
    //   sure it could work.
    props.mission = PHASE_I_MISSION_NOT_LAUNCHED_WITH_BOTH_DATES_SET
    props.resultsByMission = {
      '1': [stampUserRecord('123'),
        stampUserRecord('234'),
        stampUserRecord('123'),
        stampUserRecord('234'),
        stampUserRecord('345')],
      '2': [stampUserRecord('321')]
    }
    props.currentCourse = {
      id: 'foo'
    }
    props.user = {
      Identifier: 'me'
    }

    props.onCreateMissions = (missions, course, user) => {
      missions.length.should.eql(1)
      missions[0].userId.should.eql('321')
      missions[0].goals.length.should.eql(3)
      course.should.eql(props.currentCourse)
      user.should.eql(props.user)
    }

    const dashboard = shallow(
      <Dashboard {...props} />
    )

    dashboard.instance()._onCreateMissionsForStudents([{
      Identifier: '321',
      DisplayName: 'user'
    }])
  })

  // after( () => {
  //
  // })

})
