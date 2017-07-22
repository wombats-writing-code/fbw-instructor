import GuestCallbackContainer from 'fbw-platform-common/components/guest-callback/GuestCallbackContainer'
import GuestCallbackComponent from 'fbw-platform-common/components/guest-callback/web/GuestCallback'
import GuestConfig from '../../D2LConfig'
const GuestCallback = GuestCallbackContainer(GuestCallbackComponent, GuestConfig);

export default (store) => ({
  path : 'guest-callback',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      /*  Return getComponent   */
      cb(null, GuestCallback)

    /* Webpack named bundle   */
  }, 'guest-callback')
  }
})
