import React, {Component} from 'react'
import { browserHistory } from 'react-router'
import LoadingBox from '../../components/LoadingBox'
import './Subjects.scss'

class Subjects extends Component {
  componentDidMount () {
    // console.log('bankIds', this.props.bankIds)
    this.props.getSubjects(this.props.bankIds)
    this.props.getOutcomes()
  }

  renderRow = (rowData, index) => {
      return (
        <li className="clickable-row" key={index} onClick={() => this._onSelectSubject(rowData.id)}>
          <button className="clickable-row__button" tabIndex={index + 1}>
            <p className="row-title">{rowData.displayName.text}</p>
            <p className="row-subtitle">{rowData.description.text}</p>
          </button>
        </li>
      );
  }

  render() {
    if (this.props.isGetSubjectsInProgress || !this.props.subjects || !this.props.username) {
      return <LoadingBox />
    }

    let currentSubjects = this.props.subjects ?
                ( <ul className="row-list">
                      {_.map(this.props.subjects, this.renderRow)}
                  </ul> ) :
                ( <div className="notification">
                    <div className="notificationText">
                      No subjects configured. Please contact a Fly-by-Wire administrator.
                    </div>
                  </div> );

    return <div className="medium-8 medium-centered large-6 large-centered columns">
        {currentSubjects}
    </div>;
  }

  _onSelectSubject(subjectId) {
    if (!this.props.isSelectSubjectInProgress) {
      this.props.onSelectSubject({
        bankId: subjectId,
        username: this.props.username
      })
      // TODO: I think we may need to use the following route,
      //   instead of just /missions, for folks copy / pasting URLs.
      //   Otherwise we need to save / store the last selected subject bankId.
      // browserHistory.push(`/subjects/${subjectId}/missions`)
      browserHistory.push(`/missions`)
    }
  }

}

export default Subjects
