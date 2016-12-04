// Subjects container
import { connect } from 'react-redux'

import { getSubjects } from '../reducers/Subject/getSubjects'
import { selectSubject } from '../reducers/Subject/selectSubject'
import { getOutcomes } from '../reducers/Outcome/getOutcomes'

const mapStateToProps = (state, ownProps) => {
  // console.log('state', state);
  return {
    bankIds: state.subject.enrolledBankIds ? state.subject.enrolledBankIds : null,
    subjects: state.subject ? state.subject.subjects : null,
    isGetSubjectsInProgress: state.subject ? state.subject.isGetSubjectsInProgress : false,
    isSelectSubjectInProgress: state.subject ? state.subject.isSelectSubjectInProgress : false,
    username: state.login.username ? state.login.username : null,
    outcomesLoaded: state.outcome.outcomes ? true : false
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSelectSubject: (data) => dispatch(selectSubject(data)),
    getSubjects: (bankIds) => dispatch(getSubjects(bankIds)),
    getOutcomes: () => dispatch(getOutcomes())
  }
}

const provider = (component) => {
  return connect(mapStateToProps, mapDispatchToProps)(component)
}

export default provider
