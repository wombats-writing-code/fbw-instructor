
let devCredentials = require('./_dev.credentials');
let prodCredentials = require('./_prod.credentials');

// console.log('on host', location.host)
if (location.host === 'fbw-instructor.mit.edu') {
  // console.log('prod credentials')
  module.exports = prodCredentials
} else {
  // console.log('dev credentials')
  module.exports = devCredentials;
}
