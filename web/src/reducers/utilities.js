
import _ from 'lodash'

export const matches = (needle, haystack) => {
  let parts = needle.split(' ');
  let partQ = '';
  for (let i=0; i<parts.length; i++) {
    if (i==0) {
      partQ = '(?=.*\\b' + parts[i] + ')';
    } else {
      partQ = partQ + '(?=.*\\b' +  parts[i] + ')';
    }
  }

  let re = new RegExp(partQ, 'gi')
  let matching = re.test(haystack);

  return matching;
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
