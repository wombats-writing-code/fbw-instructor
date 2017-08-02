import React, {Component} from 'react';
import {browserHistory} from 'react-router'
import slug from 'slug'
import moment from 'moment'
import _ from 'lodash'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import {missionConfig} from 'fbw-platform-common/reducers/Mission'
import {getD2LDisplayName, getD2LDisplayNameLastFirst} from 'fbw-platform-common/selectors/login'
import LaunchPhaseII from '../LaunchPhaseII'
import './GradesTable.scss'


class GradesTable extends Component {

  constructor() {
    super();

    this.state = {
      isExpanded: true,
    }
  }

  render() {
    let props = this.props;

    let expandCollapseButtonText = this.state.isExpanded ? 'Hide' : 'Show';

    // console.log('grades', props.grades)
    if (!props.grades) {
      return null;
    }

    let columns = [
      {
        header: 'Name',
        id: 'displayName',
        accessor: d => getD2LDisplayNameLastFirst(d.user),
        width: undefined
      },
      {
        header: 'Points (%)',
        accessor: 'points',
        width: 90
      },
      {
        header: 'First opened',
        accessor: 'firstActive',
        width: undefined,
      },
      {
        header: 'Last active',
        accessor: 'lastActive',
        width: undefined
      },
      {
        header: 'Done',
        accessor: 'completed',
        width: undefined,
      }
    ];

    // {/* <button className="grades-table__edit-mission-button"
    //         onClick={(e) => this.props.onClickEditMission(grade.user)}
    //   >
    //   Edit &rarr;
    // </button> */}

    // if it's in the table for Phase II, show an edit button
    let phaseIIBlock;
    if (props.missionType === missionConfig.PHASE_II_MISSION_TYPE) {
      phaseIIBlock = (
        <div>
          <p className="grades-table__phase-2-title">Duration</p>
          {_.map(props.grades, (grade, idx) => {

            let missionForUser = this._findMissionForUser(grade.user);

            console.log('missionForUser', missionForUser)

              return (
                <div className="grades-table__phase-2-row clearfix" key={`phase-2-status__${idx}`}>
                  <p className="grades-table__edit-mission-dates"
                    onClick={() => props.onClickEditMission(missionForUser)}>
                    {missionForUser ? moment(missionForUser.startTime).format('ha ddd M/D') : ''}
                      &mdash;
                    {missionForUser ? moment(missionForUser.deadline).format('ha ddd M/D') : ''}
                  </p>
                </div>
              )
          })}
        </div>
      )

    // if it's in the table for Phase I, show the Launch button
    } else {
      phaseIIBlock = (
        <div>
          <p className="grades-table__phase-2-title">Phase II status</p>
          {_.map(props.grades, (grade, idx) => {
              return (
                <LaunchPhaseII key={`phase-2-status__${idx}`}
                            student={grade.user}
                            phaseIIDoesExist={_.find(props.missions, {user: grade.user.id, type: missionConfig.PHASE_II_MISSION_TYPE})}
                            isCreateMissionInProgress={props.isCreateMissionInProgress}
                            onClick={(student) => this.props.onClickCreateMission(student)}
                />
              )
          })}
        </div>
      )
    }

    return (
      <div className="grades-table">
        <div className="small-12 medium-9 columns no-left-padding">
          <ReactTable className="grades-table -highlight" data={props.grades} columns={columns}
                      showPagination={false}
                      defaultPageSize={props.grades.length}
                      getTdProps={(state, rowInfo, column, instance) => this._onClickHandler(state, rowInfo, column, instance)}
            />
        </div>
        <div className="small-12 medium-3 columns no-right-padding">
          {phaseIIBlock}
        </div>
      </div>
    )
  }

  _findMissionForUser(user) {
    if (!user) return null;

    // console.log('user', user)
    let lastName = user.LastName;
    let displayName = user.DisplayName;

    // if ((lastName && lastName.indexOf('Scotch') > -1) || (displayName && displayName.indexOf('Scotch') > -1)) {
    //   console.log(_.find(this.props.missions, {user: user.id, type: missionConfig.PHASE_II_MISSION_TYPE}))
    // }

    return _.find(this.props.missions, {user: user.id, type: missionConfig.PHASE_II_MISSION_TYPE})
  }

  _onClickHandler(state, rowInfo, column, instance) {
    return {
      onClick: e => {
        // console.log('e', e, 'column', column);

        let student = rowInfo.row.user;
        console.log('props', this.props);
        console.log('student', student);

        const clickedMission = this._selectClickedMissionForUser(student);
        this.props.onSelectStudent(student,
          clickedMission);

        // console.log('was clicked', rowInfo)
        // console.log('props.mission in on click handler', this.props.mission)
        // console.log('student', student)

        // setTimeout(() => {
          // console.log('debounced')
          browserHistory.push(`/students/${slug(getD2LDisplayName(student))}/missions/${slug(clickedMission.displayName)}`);
        // }, 3000);

      },
      style: {
        background: rowInfo.row.completed ? '#DFF2DF' : ''
      }
    }
  }

  _selectClickedMissionForUser(user) {
    // return the "clicked" mission for the given user
    // if ``missionType`` in props, then must be phase II
    //   otherwise it appears to be null
    // For phase I missions, the ``user`` attribute is always ``null``
    if (!user || !this.props.missionType) {
      return this.props.mission;
    }

    const result = _.find(this.props.missions, (mission) => {
      return mission.user === user._id && _.includes(mission.followsFromMissions, this.props.mission._id);
    });

    return result ? result : this.props.mission;
  }

}

export default GradesTable
