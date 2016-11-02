let moment = require('moment')

export const isLocal = (host) => host.indexOf('localhost') > -1

export const getDomain = (host) => isLocal(host) ? 'http://localhost:8888' : 'https://fbw-web-backend.herokuapp.com'

export function momentToQBank(momentObject) {
  let timeUTC = momentObject.utc().toObject();

  return {
    year: timeUTC.years,
    month: timeUTC.months + 1,
    day: timeUTC.date,
    hour: timeUTC.hours,
    minute: timeUTC.minutes,
    second: timeUTC.seconds
  }
}

export function afterMidnight(timeObject) {
  return {
    year: timeObject.year,
    month: timeObject.month,
    day: timeObject.day,
    hour: 0,
    minute: 0,
    second: 1
  }
}

export function beforeMidnight(timeObject) {
    return {
    year: timeObject.year,
    month: timeObject.month,
    day: timeObject.day,
    hour: 23,
    minute: 59,
    second: 59
  }
}

export function qbankToMoment(timeObject) {
  return moment.utc({
    years: timeObject.year,
    months: timeObject.month - 1,
    days: timeObject.day,
    hours: timeObject.hour,
    minutes: timeObject.minute,
    second: timeObject.second
  })
}

export function convertPythonDateToJS(pythonTime) {
  return {
    year: pythonTime.year,
    month: pythonTime.month - 1,
    day: pythonTime.day,
    hour: pythonTime.hour,
    minute: pythonTime.minute,
    second: pythonTime.second
  }
}

export const BANK_TO_DOMAIN = {"assessment.Bank%3A57d70ed471e482a74879349a%40bazzim.MIT.EDU": "accounting",
                               "assessment.Bank%3A576d6d3271e4828c441d721a%40bazzim.MIT.EDU": "algebra"}

export const BANK_TO_LIBRARY = {"assessment.Bank%3A57d70ed471e482a74879349a%40bazzim.MIT.EDU": "assessment.Bank%3A57279fbce7dde086c7fe20ff%40bazzim.MIT.EDU",
                                "assessment.Bank%3A576d6d3271e4828c441d721a%40bazzim.MIT.EDU": "assessment.Bank%3A57279fb9e7dde086d01b93ef%40bazzim.MIT.EDU"}

export const LO_SCAFFOLD_MISSION_GENUS_TYPE = "assessment-part-genus-type%3Afbw-specify-lo%40ODL.MIT.EDU"
export const TEST_FLIGHT_MISSION = "assessment-genus%3Afbw-in-class-mission%40ODL.MIT.EDU"
export const PRE_FLIGHT_MISSION = "assessment-genus%3Afbw-homework-mission%40ODL.MIT.EDU"