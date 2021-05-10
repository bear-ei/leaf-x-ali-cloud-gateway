import {fetch} from '@leaf-x/fetch';
import {initGetRequestHeaders} from './headers';
import {HttpMethod, InitRequest} from './interface/request.interface';
import {getToken} from './token';

export const initRequest: InitRequest = gatewayOptions => (url, options) => {
  const {method = 'GET', body, headers} = options ?? {};

  const requestHeaders = initGetRequestHeaders(gatewayOptions)({headers, body});
  const {canonicalHeadersKeysString, sign} = getToken({
    url,
    secret: gatewayOptions.appSecret,
    method: method.toLocaleUpperCase() as HttpMethod,
    headers: requestHeaders,
  });

  const token = {
    'x-ca-signature': sign,
    'x-ca-signature-headers': canonicalHeadersKeysString,
  };

  return fetch(url, {method, body, headers: {...requestHeaders, ...token}});
};
