import {fetch, handleUrl} from '@leaf-x/fetch';
import {initGetRequestHeaders} from './headers';
import {HttpMethod, InitRequest} from './interface/request.interface';
import {getToken} from './token';

export const initRequest: InitRequest = gatewayOptions => (url, options) => {
  const {
    method = 'GET',
    body,
    data,
    headers,
    params = {},
    ...args
  } = options ?? {};

  const requestBody = data ? data : body;
  const requestHeaders = initGetRequestHeaders(gatewayOptions)({
    headers,
    data: requestBody,
  });

  const requestUrl = handleUrl({url, params});
  const {canonicalHeadersKeysString, sign} = getToken({
    url: requestUrl,
    secret: gatewayOptions.appSecret,
    method: method.toLocaleUpperCase() as HttpMethod,
    headers: requestHeaders,
  });

  return fetch(requestUrl, {
    method,
    data: requestBody,
    headers: {
      ...requestHeaders,
      'x-ca-signature': sign,
      'x-ca-signature-headers': canonicalHeadersKeysString,
    },
    timeout: gatewayOptions.timeout,
    ...args,
  });
};
