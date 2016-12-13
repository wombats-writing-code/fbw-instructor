// import {adjustedQBankToMomentObj} from 'fbw-platform-common/utilities'


// action type
export const SELECT_MISSION = 'SELECT_MISSION'


// action
export function selectMission(mission) {
  // if (mission && mission.startTime) {
  //   console.log('pre-select startTime', mission.startTime)
  //   mission.startTime = adjustedQBankToMomentObj(mission.startTime)
  //   mission.deadline = adjustedQBankToMomentObj(mission.deadline)
  //   console.log('adjusted startTime', mission.startTime)
  // }
  return {type: SELECT_MISSION, mission};
}
