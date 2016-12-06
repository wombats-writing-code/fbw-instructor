//
// export default (store) => ({
//   path : 'mission-control',
//   /*  Async getComponent is only invoked when route matches   */
//   getComponent (nextState, cb) {
//     /*  Webpack - use 'require.ensure' to create a split point
//         and embed an async module loader (jsonp) when bundling   */
//     require.ensure([], (require) => {
//       /*  Webpack - use require callback to define
//           dependencies for bundling   */
//       const MissionControl = require('./MissionFormContainer').default
//
//       /*  Return getComponent   */
//       cb(null, MissionControl)
//
//     /* Webpack named bundle   */
//   }, 'mission-control')
//   }
// })

import MissionFormContainer from './MissionFormContainer'

export default MissionFormContainer
