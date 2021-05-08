import {fetch} from '@leaf-x/fetch';
import {initGetRequestHeaders} from './headers';
import {getToken} from './token';

export const initRequest = options => ({
  method = 'GET',
  url,
  body,
  headers = {'content-type': 'application/json; charset=utf-8'},
}) => {
  const requestHeaders = initGetRequestHeaders(options)({headers, body});

  const {canonicalHeadersString, sign} = getToken({
    secret,
    method,
    headers: requestHeaders,
  });

  const token = {
    'x-ca-signature': canonicalHeadersString,
    'x-ca-signature-headers': sign,
  };

  options.headers
    ? Object.assign(options.headers, {...token})
    : Object.assign(options, {headers: {...token}});

  return fetch(url, options);
};
