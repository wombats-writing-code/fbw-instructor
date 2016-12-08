

export const matches = (needle, haystack) => {

  return _.lower(haystack).indexOf(_.lower(needle)) === 0;
}



export const getDomain = () => location.host.indexOf('localhost') > 1 ? 'http://localhost:8888' : 'https://fbw-web-backend.herokuapp.com'

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

export function convertPythonDateToJS (pythonTime) {
  return {
    year: pythonTime.year,
    month: pythonTime.month - 1,
    day: pythonTime.day,
    hour: pythonTime.hour,
    minute: pythonTime.minute,
    second: pythonTime.second
  }
}

export function getSchoolQBankId (school) {
  return `fbw-school%3A${school}%40FBW.MIT.EDU`
}

export const SCHOOL_TO_BANK = {"acc": "assessment.Bank%3A57279fc2e7dde08807231e61%40bazzim.MIT.EDU",
                               "qcc": "assessment.Bank%3A57279fcee7dde08832f93420%40bazzim.MIT.EDU"}

export const BANK_TO_DOMAIN = {"assessment.Bank%3A57d70ed471e482a74879349a%40bazzim.MIT.EDU": "accounting",
                               "assessment.Bank%3A576d6d3271e4828c441d721a%40bazzim.MIT.EDU": "algebra"}

export const BANK_TO_LIBRARY = {"assessment.Bank%3A57d70ed471e482a74879349a%40bazzim.MIT.EDU": "assessment.Bank%3A57279fbce7dde086c7fe20ff%40bazzim.MIT.EDU",
                                "assessment.Bank%3A576d6d3271e4828c441d721a%40bazzim.MIT.EDU": "assessment.Bank%3A57279fb9e7dde086d01b93ef%40bazzim.MIT.EDU"}

export const LO_SCAFFOLD_MISSION_GENUS_TYPE = "assessment-part-genus-type%3Afbw-specify-lo%40ODL.MIT.EDU"
export const TEST_FLIGHT_MISSION = "assessment-genus%3Afbw-in-class-mission%40ODL.MIT.EDU"
export const PRE_FLIGHT_MISSION = "assessment-genus%3Afbw-homework-mission%40ODL.MIT.EDU"
export const PHASE_I_MISSION_RECORD_TYPE = "assessment-record-type%3Afbw-phase-i%40ODL.MIT.EDU"
export const PHASE_II_MISSION_RECORD_TYPE = "assessment-record-type%3Afbw-phase-ii%40ODL.MIT.EDU"

export const BASE_BANKS = ['assessment.Bank%3AROOT%40ODL.MIT.EDU',
  'assessment.Bank%3A000000000000000000000000%40ODL.MIT.EDU',
  'assessment.Bank%3A000000000000000000000000%40bazzim.MIT.EDU']
export const INSTRUCTOR_AUTHORIZATION_FUNCTIONS = ['assessment.AssessmentTaken%3Acreate%40ODL.MIT.EDU',
  'assessment.AssessmentTaken%3Alookup%40ODL.MIT.EDU',
  'assessment.Assessment%3Atake%40ODL.MIT.EDU',
  'assessment.Bank%3Alookup%40ODL.MIT.EDU',
  'commenting.Book%3Alookup%40ODL.MIT.EDU',
  'commenting.Comment%3Alookup%40ODL.MIT.EDU',
  'hierarchy.Hierarchy%3Alookup%40ODL.MIT.EDU',
  'logging.Log%3Alookup%40ODL.MIT.EDU',
  'repository.Asset%3Acreate%40ODL.MIT.EDU',
  'repository.Asset%3Adelete%40ODL.MIT.EDU',
  'repository.Asset%3Alookup%40ODL.MIT.EDU',
  'repository.Asset%3Asearch%40ODL.MIT.EDU',
  'repository.Repository%3Alookup%40ODL.MIT.EDU',
  'resource.Bin%3Alookup%40ODL.MIT.EDU',
  'resource.Resource%3Alookup%40ODL.MIT.EDU']
