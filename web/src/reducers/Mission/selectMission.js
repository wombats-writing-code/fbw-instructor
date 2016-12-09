import {adjustedQBankToMoment} from '../common'


// action type
export const SELECT_MISSION = 'SELECT_MISSION'


// action
export function selectMission(mission) {
  if (mission && mission.startTime) {
    mission.startTime = adjustedQBankToMoment(mission.startTime)
    mission.deadline = adjustedQBankToMoment(mission.deadline)
  }
  return {type: SELECT_MISSION, mission};
}
