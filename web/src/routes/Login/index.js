import LoginComponent from '@wombats-writing-code/fbw-platform-common/components/login/web/Login';
import LoginContainer from '@wombats-writing-code/fbw-platform-common/components/login/LoginContainer'
import D2LConfig from '../../D2LConfig'
const Login = LoginContainer(LoginComponent, D2LConfig)


export default (store) => ({
  path : 'login',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */

      /*  Return getComponent   */
      cb(null, Login)

    /* Webpack named bundle   */
  }, 'login')
  }
})
