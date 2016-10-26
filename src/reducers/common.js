

export const isLocal = (host) => host.indexOf('localhost') > -1

export const getDomain = (host) => isLocal(host) ? 'http://localhost:8888' : 'https://fbw-web-backend.herokuapp.com'
