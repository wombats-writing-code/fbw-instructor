// prod credentials

let credentials = {
  role: 'instructor',
  appID: 'EwVxZxhvGRX6zvYGOBJGBw',
  appKey: 'fPQbxLtdJFjGuaV-0-Vxjg',
  host: process.env.NODE_ENV === 'production' ? 'https://acc.desire2learn.com' : 'http:localhost:8888:/mock-d2l',
  port: process.env.NODE_ENV === 'production' ? 443 : 80,     // so that the valence lib doesn't append a :port to the string.
  callbackUrl: process.env.NODE_ENV === 'production' ? 'https://fbw-instructor.mit.edu/d2l-callback' : 'http:localhost:3000'
}

module.exports = credentials;
