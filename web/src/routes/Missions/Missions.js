'use strict'
import moment from 'moment'
import React, { Component } from 'react'
import slug from 'slug'

import LoadingBox from '../../components/LoadingBox'
import './Missions.scss'

import { localDateTime, checkMissionStatus } from 'platform-common/selectors/'

class Missions extends Component {

  componentDidMount () {
    // this will probably never get called from here,
    // because the bankId isn't returned until after this
    // has mounted.
    if (this.props.bankId) {
      console.log('getting missions in mount')
      this.props.getMissions({
        bankId: this.props.bankId,
        username: this.props.username
      })
    }
  }
  componentWillUpdate (nextProps, nextState) {
    // This is horrible, but is the only combination
    //   I could find to not make redundant getMission calls...
    // The alternative is to make Actions.missions()
    //   a callback for selectSubject, instead of calling it immediately
    if (nextProps.bankId &&
        !(nextProps.isGetMissionsInProgress ||
          this.props.isGetMissionsInProgress) &&
        (this.props.bankId !== nextProps.bankId ||
         !this.props.missions)) {
      this.props.getMissions({
        bankId: nextProps.bankId,
        username: this.props.username
      })
    }
  }

  renderRow = (rowData, sectionId, rowId) => {
    // Let students view past missions, but not submit any choices.
    // TODO: get the subject names from D2L

    let dlLocal = localDateTime(rowData.deadline).toDate(),
      now = new Date(),
      deadlineText = 'Due',
      timeRemaining = (dlLocal - now) / 1000 / 60 / 60 / 24 ;

    let deadlineStyle;
    if (timeRemaining <= 1) {
      deadlineStyle = {color: 'red'}
    }
    if (timeRemaining <= 0) {
      deadlineText = 'Closed'
    }

    // console.log(dlLocal)
    // console.log('missions rowData', rowData)

    let missionTypeIconSource
    if (rowData.genusTypeId === 'assessment-genus%3Afbw-homework-mission%40ODL.MIT.EDU') {
      missionTypeIconSource = require('platform-common/assets/phase-1-icon@2x.png')

    } else if (rowData.genusTypeId === 'assessment-genus%3Afbw-in-class-mission%40ODL.MIT.EDU') {
      missionTypeIconSource = require('platform-common/assets/phase-2-icon@2x.png');

    } else {
      console.error('uh oh. could not recognize genusTypeId in Missions.js');
    }

    return (
      <li className="clickable-row" key={sectionId} onClick={() => this._onSelectMission({mission: rowData, username: this.props.username})}>
        <button className="clickable-row__button" >
          <div className="flex-container align-center">
            <img className="mission-type-icon" src={missionTypeIconSource} />

            <div>
              <p className="row-title text-left">
                {rowData.displayName.text}
              </p>
              <p className="row-subtitle text-left" style={deadlineStyle}>
                {deadlineText}: {dlLocal.getMonth() + 1}-{dlLocal.getDate()}-{dlLocal.getFullYear()}
              </p>
            </div>
          </div>
      </button>
    </li>
    )
  }

  render() {
    if (this.props.isGetMissionsInProgress || !this.props.missions) {
      return  <LoadingBox/>
    }

    let currentMissions = this.props.missions.length > 0 ?
                ( <ul className="row-list">
                    {_.map(this.props.missions, this.renderRow)}
                  </ul> ) : null;

    return (<div className="medium-8 medium-centered large-6 large-centered columns">
          {currentMissions}
      </div>)
  }

  _onSelectMission (data) {
    let missionState = checkMissionStatus(data.mission)
    if (missionState === 'over') {
      this.props.onSelectClosedMission(data)
    } else {
      this.props.onSelectOpenMission(data)
    }
    browserHistory.push(`/missions/${slug(data.mission.displayName.text)}`)
  }

}

export default Missions
