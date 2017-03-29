import React, {Component} from 'react';
import {browserHistory} from 'react-router'
import slug from 'slug'
import _ from 'lodash'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import {getD2LDisplayName, getD2LDisplayNameLastFirst} from 'fbw-platform-common/selectors/login'
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
      },
      {
        header: 'Points (%)',
        accessor: 'points'
      },
      {
        header: 'First opened',
        accessor: 'firstActive'
      },
      {
        header: 'Last active',
        accessor: 'lastActive'
      },
    ];

    return (
      <div className="grades-table">

        <ReactTable className="grades-table -highlight" data={props.grades} columns={columns}
                    showPagination={false}
                    defaultPageSize={props.grades.length}
                    getTdProps={(state, rowInfo, column, instance) => this._onClickHandler(state, rowInfo, column, instance)}
          />

      </div>
    )
  }

  _onClickHandler(state, rowInfo, column, instance) {
    return {
      onClick: e => {
        let student = rowInfo.row.user;
        this.props.onSelectStudent(student, this.props.mission, this.props.user);

        // console.log('was clicked', rowInfo)
        // console.log('props.mission', this.props.mission)
        // console.log('student', student)

        browserHistory.push(`/students/${slug(getD2LDisplayName(student))}/missions/${slug(this.props.mission.displayName)}`);
      }
    }
  }

}

export default GradesTable
