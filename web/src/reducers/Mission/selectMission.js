import {qbankToMoment} from '../common'


// action type
export const SELECT_MISSION = 'SELECT_MISSION'


// action
export function selectMission(mission) {
  if (mission && mission.startTime) {
    mission.startTime = qbankToMoment(mission.startTime)
    mission.deadline = qbankToMoment(mission.deadline)
  }
  return {type: SELECT_MISSION, mission};
}
