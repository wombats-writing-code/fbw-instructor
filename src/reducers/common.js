

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