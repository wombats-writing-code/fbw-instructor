import React from 'react'
import MissionEdit from '../MissionEdit'
import { mount, shallow } from 'enzyme'
import { missionConfig } from 'fbw-platform-common/reducers/Mission'

import '../../../styles/foundation.min.css'
import '../../../styles/core.scss'
import '../../../styles/animations.scss'

let chai = require('chai')
chai.should()

const PHASE_I_MISSION = {
  type: missionConfig.PHASE_I_MISSION_TYPE
}

const PHASE_II_MISSION = {
  type: missionConfig.PHASE_II_MISSION_TYPE
}

describe('MissionEdit', () => {
  let props;

  beforeEach( () => {
    props = {
      isCreateMissionInProgress: false,
      mapping: {},
      editView: ''
    }
  })

  it('should render three date inputs for Phase I mission type on create', () => {
    const div = global.document.createElement('div')
    global.document.body.appendChild(div)

    props.newMission = PHASE_I_MISSION

    const missionEdit = mount(
      <MissionEdit {...props} />,
      { attachTo: div }
    )

    missionEdit.find('.rdt').length.should.be.eql(3)

    missionEdit.detach()
  })

  it('should render three date inputs for Phase I mission type on edit', () => {
    const div = global.document.createElement('div')
    global.document.body.appendChild(div)

    props.newMission = PHASE_I_MISSION
    props.editView = 'edit'

    const missionEdit = mount(
      <MissionEdit {...props} />,
      { attachTo: div }
    )

    missionEdit.find('.rdt').length.should.be.eql(3)

    missionEdit.detach()
  })

  it('should render two date inputs for Phase II mission type on create', () => {
    const div = global.document.createElement('div')
    global.document.body.appendChild(div)

    props.newMission = PHASE_II_MISSION

    const missionEdit = mount(
      <MissionEdit {...props} />,
      { attachTo: div }
    )

    missionEdit.find('.rdt').length.should.be.eql(2)

    missionEdit.detach()
  })

  it('should render two date inputs for Phase II mission type on edit', () => {
    const div = global.document.createElement('div')
    global.document.body.appendChild(div)

    props.newMission = PHASE_II_MISSION
    props.editView = 'edit'

    const missionEdit = mount(
      <MissionEdit {...props} />,
      { attachTo: div }
    )

    missionEdit.find('.rdt').length.should.be.eql(2)

    missionEdit.detach()
  })

  // after( () => {
  //
  // })

})
