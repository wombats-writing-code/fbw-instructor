
import _ from 'lodash'

export const matches = (needle, haystack) => {

  return _.lowerCase(haystack).indexOf(_.lowerCase(needle)) === 0;
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
