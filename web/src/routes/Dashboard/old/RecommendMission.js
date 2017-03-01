import React, {Component} from 'react';
import _ from 'lodash'
import {Link} from 'react-router'
import moment from 'moment'
import {getD2LDisplayName} from 'fbw-platform-common/selectors/login'
import { DateRangePicker } from 'react-dates'
import 'react-dates/css/variables.scss'
import 'react-dates/css/styles.scss'

// import {osidToDisplayName} from 'fbw-platform-common/selectors/login'

// require('./datepicker.css')
import './RecommendMission.scss'

const _getPlurality = (number) => {
  if (number === 1) return '';

  return 's';
}

class RecommendMissionView extends Component {

  constructor() {
    super();
    this.state = {
      focused: null,
      isExpanded: false
    };
  }

  render() {
    let props = this.props;

    if (!props.recommendations || props.recommendations.length === 0) {
      return null;
    }

    // console.log('props of recommend mission', props.recommendations);

    let studentCollection, datePicker;
      studentCollection = (
        <div>
          <p className="bold">Recommendations</p>
          <ul className="student-recommendations-list">
            {_.map(props.recommendations, (rec, idx) => {
              console.log('rec', rec);

              return (
                <li key={`student_${idx}`}>
                  <p>
                    <Link key={`studentName__${idx}`} className="link">{getD2LDisplayName(rec.student)}</Link>
                    <span> will get </span>
                    <span>{rec.goals.length} </span>
                    <span>goal{_getPlurality(rec.goals.length)} with </span>
                    <span>{rec.goals.length * 3} </span>
                    question{_getPlurality(rec.goals.length * 3)}.</p>
                </li>
              )
            })}
          </ul>
        </div>
      )

      datePicker = (<div className="form-section clearfix">
         <label className="form-label">Dates</label>
         <DateRangePicker className=""
                          focusedInput={this.state.focused}
                          onFocusChange={(focused) => this.setState({focused})}
                          onDatesChange={(dateData) => props.onSpawnDateChange(dateData)}
                          startDate={props.spawnDate.startTime}
                          endDate={props.spawnDate.deadline} />
       </div>)


    let expandCollapseButtonText;
    if (props.mission) {
      expandCollapseButtonText = this.state.isExpanded ? 'Hide' : 'Show';
    } else {
      expandCollapseButtonText = 'No results yet';
    }

    // console.log('focused', this.state.focused)

    return (
      <div className="">
        {/* {recommendationsBar} */}

        {datePicker}
        {studentCollection}

      </div>
    )
  }

}

export default RecommendMissionView
