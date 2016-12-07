import React, {Component} from 'react'
import { browserHistory } from 'react-router'

import { getAuthenticationUrl } from './d2lutils'
import credentials from './d2lcredentials'

const styles = {
  container: {
    backgroundColor: '#86bEa4',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  },
  usernameInput: {
    fontSize: 20,
    textAlign: 'center',
    height: 42,
    marginTop: 21,
    marginBottom: 21
  },
  // usernameInputWrapper: {
  //   maxWidth: 320,
  //   height: 42,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#eee',
  //   borderStyle: 'solid'
  // },
  schoolButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 21
  },
  schoolButton: {
    flexDirection: 'row',
    width: 250,
    padding: 10.5,
    margin: 24,
    border: '1px solid #fff',
    borderRadius: 5,
    justifyContent: 'center'
  },
  schoolButtonText: {
    color: '#fafafa',
    fontSize: 24,
    textAlign: 'center'
    // flex: 1,
    // width: 130,
    // minWidth: 130,
    // maxWidth: 130
  },
  disabledButton: {
    flexDirection: 'row',
    width: 250,
    padding: 10.5,
    margin: 24,
    border: '1px solid #dddddd',
    backgroundColor: 'gray',
    borderRadius: 5,
    justifyContent: 'center',
    opacity: 0.5
  },
  disabledButtonText: {
    color: '#fafafa',
    fontSize: 24,
    textAlign: 'center'
  },
  loginButton: {
    width: 140,
    backgroundColor: 'transparent',
    margin: 10,
    padding: 10,
    border: '1px solid #fff',
    borderRadius: 5
  },
  loginButtonText: {
    textAlign: 'center',
    fontWeight: "600",
    color: '#fff'
  },
  cancelButton: {
    width: 70,
    backgroundColor: 'transparent',
    margin: 5,
    padding: 5,
    border: '1px solid #fff',
    borderRadius: 5
  },
  cancelButtonText: {
    textAlign: 'center',
    fontWeight: "300",
    color: '#fff',
    fontSize: 12
  },
  visitorLoginWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  visitorLoginContainer: {
    padding: 25,
    margin: 24,
    border: '1px solid #fff',
    borderRadius: 5,
    width: 300
  },
  navTitle: {
    color: '#fff'
  }
}

class Login extends Component {

  constructor() {
    super();

    this.state = {
      isVisitorLoginVisible: false
    }
  }

  componentDidMount () {
    if (this.props.username) {
      this.props.logout()
    }
  }

  componentDidUpdate () {
    if (this.props.isVisitor && this.textInput) {
      this.textInput.focus()
    }
  }

  render() {
    const props = this.props;

    let loginButtonText
    if (props.isLoginInProgress) {
      loginButtonText = (<div style={styles.loginButtonText}>Logging you in...</div>)
    } else {
      loginButtonText = (<div style={styles.loginButtonText}>
        Login
      </div>)
    }

    let visitorLogin = (<button onClick={() => this.setState({isVisitorLoginVisible: true})}
                                style={styles.visitorButton}>
      <div style={styles.loginButtonText}>Visiting?</div>
    </button>);

    if (this.state.isVisitorLoginVisible) {
      let loginButton
      if (this.props.username !== '') {
        loginButton = (<input type="submit" style={styles.loginButton}/>
        )
      }
      visitorLogin = (
        <div style={styles.visitorLoginWrapper}>
          <div style={styles.visitorLoginContainer}>
            <button onClick={() => this.setState({isVisitorLoginVisible: false})} style={styles.cancelButton}>
              <div style={styles.cancelButtonText}>Cancel</div>
            </button>

            <form onSubmit={(e) => this._loginUserSimple(e)}>
              <input type="text"
                ref={(input) => {this.textInput = input;}}
                onChange={(e) => props.updateUsername({ username: e.target.value.toUpperCase() })}
                placeholder='Username'
                style={styles.usernameInput}
                value={props.username} />

              {loginButton}
            </form>
          </div>
        </div>
      )
    }

    return (
      <div style={styles.container} >
        <div>
          <h4 style={styles.navTitle}>FLY-BY-WIRE</h4>
        </div>
        <div style={styles.schoolButtons}>
          <button onClick={() => this._handleACCLogin()}
            style={styles.schoolButton}>
            <div style={styles.schoolButtonText}>Arapahoe</div>
          </button>
          <button disabled
            onClick={() => this._handleQCCLogin()}
            style={styles.disabledButton}>
            <div style={styles.schoolButtonText}>Quinsigamond</div>
          </button>
        </div>
        {visitorLogin}
      </div>
    )
  }

  _handleACCLogin = () => {
    let authenticationUrl = getAuthenticationUrl(credentials)
    window.open(authenticationUrl, '_self')
  }

  _handleQCCLogin = () => {
    Actions.error({
      message: `QCC currently is not supported.`
    })
  }

  _loginUserSimple = (e) => {
    //console.log(this.props.username)
    e.preventDefault()
    if (this.props.username !== '') {
      this.props.login('fbw-visitor', this.props.username)
      this._goToSubjects(null)  // for default banks
    }
  }

  _goToSubjects = (bankIds) => {
    // leave bankIds null for default banks
    this.props.onSetEnrolledSubjects(bankIds)
    browserHistory.push('/')
  }

  // _onLogin(username, school) {
  //   this.props.login(username, school);
  //   browserHistory.push('/')
  // }

}

export default Login
