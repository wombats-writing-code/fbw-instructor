import LoginErrorComponent from '@wombats-writing-code/fbw-platform-common/components/login-error/web/LoginError';
import LoginErrorContainer from '@wombats-writing-code/fbw-platform-common/components/login-error/LoginErrorContainer'
const LoginError = LoginErrorContainer(LoginErrorComponent)


export default (store) => ({
  path : 'login-error',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */

      /*  Return getComponent   */
      cb(null, LoginError)

    /* Webpack named bundle   */
  }, 'login-error')
  }
})
