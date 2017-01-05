// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout/CoreLayout'
// import CounterRoute from './Counter'            // boilerplate for reference only

import HomeContainer from './Home/index'
import D2LCallbackRoute from './D2LCallback/'
import LoginRoute from './Login'
import StudentRoute from './Student'

import MissionForm from '../components/MissionForm'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path        : '/',
  component   : CoreLayout,
  indexRoute  : HomeContainer,
  childRoutes : [
    // CounterRoute(store),
    LoginRoute(store),
    D2LCallbackRoute(store),
    StudentRoute(store),
    {
      path: '/missions/new',
      component: MissionForm
    }
  ]
})

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
