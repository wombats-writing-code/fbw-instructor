// import { injectReducer } from '../../store/reducers'
import D2LCallbackComponent from './D2LCallback'

export default (store) => ({
  path : 'd2l-callback',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const D2LCallbackFactory = require('platform-common/containers/D2LCallbackContainer').default

      /*  Return getComponent   */
      cb(null, D2LCallbackFactory(D2LCallbackComponent))

    /* Webpack named bundle   */
  }, 'd2l-callback')
  }
})
