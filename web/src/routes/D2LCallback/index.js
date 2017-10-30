import D2LCallbackContainer from '@wombats-writing-code/fbw-platform-common/components/d2l-callback/D2LCallbackContainer'
import D2LCallbackComponent from '@wombats-writing-code/fbw-platform-common/components/d2l-callback/web/D2LCallback'
import D2LConfig from '../../D2LConfig'
const D2LCallback = D2LCallbackContainer(D2LCallbackComponent, D2LConfig);

export default (store) => ({
  path : 'd2l-callback',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      /*  Return getComponent   */
      cb(null, D2LCallback)

    /* Webpack named bundle   */
  }, 'd2l-callback')
  }
})
