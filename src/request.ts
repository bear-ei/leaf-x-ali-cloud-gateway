import {fetch} from '@leaf-x/fetch';
import {initGetRequestHeaders} from './headers';
import {HttpMethod, InitRequest} from './interface/request.interface';
import {getToken} from './token';

export const initRequest: InitRequest = gatewayOptions => (url, options) => {
  const {method = 'GET', body, headers, params = {}, ...args} = options ?? {};
  const requestHeaders = initGetRequestHeaders(gatewayOptions)({headers, body});
  //   const requestUrl = handleUrl({url, params});

  console.info(url);
  const {canonicalHeadersKeysString, sign} = getToken({
    url: url,
    secret: gatewayOptions.appSecret,
    method: method.toLocaleUpperCase() as HttpMethod,
    headers: requestHeaders,
  });

  return fetch(url, {
    method,
    body,
    headers: {
      ...requestHeaders,
      'x-ca-signature': sign,
      'x-ca-signature-headers': canonicalHeadersKeysString,
    },
    ...args,
  });
};
