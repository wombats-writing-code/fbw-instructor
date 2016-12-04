// reducers/index.js

import missionReducer from './Mission/Mission'
import loginReducer from './Login/Login'
import subjectReducer from './Subject/Subject'
import outcomeReducer from './Outcome/Outcome'
// ... other reducers

export default {
  mission: missionReducer,
  login: loginReducer,
  subject: subjectReducer,
  outcome: outcomeReducer,
  // ... other reducers
};
