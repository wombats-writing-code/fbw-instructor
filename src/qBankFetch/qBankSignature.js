'use strict';


import crypto from 'crypto-js'
import 'buffer'

// var Buffer = require('buffer').Buffer;

// as a test:
// input:
//    'POST /api/v2/assessment/banks/ HTTP/1.1\naccept: application/json\ndate: Mon, 14 Mar 2016 14:41:27 GMT\nhost: testserver:80\nx-api-proxy: taaccct_instructor'
// hashed but not encoded signature:
//    '\xf7y\x8e\xb5\xca\xf0>H \xf2\xf7\xd2\x10\\s\r\xeen\xcb\x9a\xcd\x94&\xef\x80\xc8\xd0\xa2\xfa5\nZ'
// expected signature:
//    '93mOtcrwPkgg8vfSEFxzDe5uy5rNlCbvgMjQovo1Clo='
// with public key: sIcaXKd67Y80MufpCB73
// and private key: LKswkklexT14vbudS4jOGzHvcEG48O1dAvhcVSJQ

const ALGORITHM = 'hmac-sha256';
const REQUIRED_HEADERS = [
  'request-line',
  'accept',
  'date',
  'host',
  'x-api-proxy'
];

const hmac = (key, string) => {
  var hmacOutput = crypto.HmacSHA256(string, key).toString(crypto.enc.HEX);
  var b = new Buffer(hmacOutput, 'hex');

  return b.toString('base64');
}

const getSignature = (options) => {
  let method = options.method.toUpperCase();
  let pathName = decodeURI(options.path).replace(/ /g, '%20');  // escape spaces, so server-side signing works
  let headers = options.headers;
  let credentials = options.credentials;
  let datetime = options.headers.hasOwnProperty('date') ? options.headers.date : new Date.toUTCString();

  let stringToSign = `${method.toUpperCase()} ${pathName} HTTP/1.1
  accept: ${headers.accept}
  date: ${datetime}
  host: ${headers.host}
  x-api-proxy: ${headers['x-api-proxy']}`;

  return hmac(options.credentials.SecretKey, stringToSign);
}

const getSignedHeaders = (headers) => {
  return headers.join(' ');
}

const qBankSignature = (options) => {
  return `Signature headers="${getSignedHeaders(REQUIRED_HEADERS)}",keyId="${options.credentials.AccessKeyId}",algorithm="${ALGORITHM}",signature="${getSignature(options)}"`;
}

export default qBankSignature
