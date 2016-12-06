

export const matches = (needle, haystack) => {

  return _.lower(haystack).indexOf(_.lower(needle)) === 0;
}



export const getDomain = () => location.host.indexOf('localhost') > 1 ? 'http://localhost:8888' : 'https://fbw-web-backend.herokuapp.com'
