import CoreLayout from '../layouts/CoreLayout/CoreLayout'

import HomeContainer from './Home/index'
import D2LCallbackRoute from './D2LCallback/'
import GuestCallbackRoute from './GuestCallback/'
import LoginRoute from './Login'
import LoginErrorRoute from './LoginError'
import LogOutSuccessRoute from './LogOutSuccess'
import MissionsRoute from './Missions'
import StudentRoute from './Student'
import DashboardRoute from './Dashboard'
import MissionEditRoute from './MissionEdit'

import GuideRoute from './Guide'

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
    GuestCallbackRoute(store),
    LogOutSuccessRoute(store),
    MissionsRoute(store),
    DashboardRoute(store),
    StudentRoute(store),
    MissionEditRoute(store),
    GuideRoute(store),
    LoginErrorRoute(store)
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
