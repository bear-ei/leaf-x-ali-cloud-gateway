import {fetch, handleUrl} from '@leaf-x/fetch';
import {initGetRequestHeaders} from './headers';
import {InitRequest} from './interface/request.interface';

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
  const requestUrl = handleUrl({url, params});
  const requestHeaders = initGetRequestHeaders(gatewayOptions)({
    url: requestUrl,
    method,
    data: requestBody,
    headers,
    // params,
  });

  return fetch(requestUrl, {
    method,
    data: requestBody,
    headers: requestHeaders,
    timeout: gatewayOptions.timeout,
    ...args,
  });
};
