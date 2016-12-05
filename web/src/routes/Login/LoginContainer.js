import { connect } from 'react-redux'
import Login from './Login'



const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: () => dispatch()
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login)
