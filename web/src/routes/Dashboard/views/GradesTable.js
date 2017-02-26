import React, {Component} from 'react';
import _ from 'lodash'
import {getD2LDisplayName} from 'fbw-platform-common/selectors/login'
import './GradesTable.scss'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

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

    let columns = [
      {
        header: 'Name',
        id: 'displayName',
        accessor: d => getD2LDisplayName(d.user),
      },
      {
        header: 'Points (%)',
        accessor: 'points'
      },
      {
        header: 'Status',
        accessor: 'status'
      },
    ];

    return (
      <div className="grades-table">

        <ReactTable className="grades-table" data={props.grades} columns={columns}
                    showPagination={false}
                    defaultPageSize={props.grades.length}
          />

      </div>
    )
  }


}

export default GradesTable
