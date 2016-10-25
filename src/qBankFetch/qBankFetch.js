
let request = require('request');
let rp = require('request-promise');

import qBankSignature from './qBankSignature'


// wrapper around global fetch to include signing
function initQBankFetch(credentials) {

  return function qBankFetch(params) {
    let domainUrl = credentials['qbank'].Host.indexOf('mit.edu') >= 0 ? `https://${credentials['qbank'].Host}/api/v2/` : `http://${credentials['qbank'].Host}/api/v2/`;

    let url = domainUrl + params.path;
    let headerPath = url.indexOf('mit.edu') >= 0 ? url.split('mit.edu')[1] : url.split(':8003')[1];
    let now = new Date();

    if (url.indexOf('%3A') >= 0) {
      // let's only decode the stuff we care about ... otherwise magic question IDs
      // get messed up -- this shouldn't be necessary in the future with Jeff's change
      // to abstract the magic question IDs out.
        url = url.replace(/%3A/g, ':').replace(/%40/g, '@');
        headerPath = headerPath.replace(/%3A/g, ':').replace(/%40/g, '@');
    }

    let headers = {
      'User-Agent': 'request-promise',
      'request-line': headerPath,
      'accept': 'application/json',
      'date': now.toUTCString(),
      'host': credentials['qbank'].Host,
      'x-api-key': credentials['qbank'].AccessKeyId,
      'x-api-proxy': params.proxy ? params.proxy : credentials['qbank'].Proxy
    };
    headers['authorization'] = qBankSignature({
        path: headerPath,
        method: params.hasOwnProperty('method') ? params.method : 'GET',
        headers: headers,
        credentials: credentials['qbank']
    });

    var options = {
      uri: url,
      headers: headers,
      method: params.method || 'GET',
    };

    if (params.hasOwnProperty('data')) {
      if (typeof params.date == "string") {
        options['body'] = params.data;
      } else {
        options['body'] = JSON.stringify(params.data);
        headers.append('Content-Type', 'application/json');
      }
    }

    console.log('options sent', options)

    // return rp(options);
    return fetch(options.uri, options);
  }
}

export default initQBankFetch
