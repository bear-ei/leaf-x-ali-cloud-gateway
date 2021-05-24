import {fetch, handleRequestUrl} from '@leaf-x/fetch';
import {headers as globalHeaders, initGetRequestHeaders} from './headers';
import {InitRequest} from './interface/request.interface';

export const initRequest: InitRequest =
  gatewayOptions =>
  (url, options = {}) => {
    const {
      method = 'GET',
      body,
      data,
      headers,
      params = {},
      host,
      ...args
    } = options;

    const requestBody = data ? data : body;
    const requestUrl = handleRequestUrl({url, params});
    const addHeaders = {} as Record<string, string>;

    for (const key of globalHeaders.keys()) {
      Object.assign(addHeaders, {[key]: globalHeaders.get(key)});
    }

    const requestHeaders = initGetRequestHeaders(gatewayOptions)({
      url: requestUrl,
      method,
      data: requestBody,
      headers: {...addHeaders, ...headers},
      params,
      host,
    });

    return fetch(requestUrl, {
      method,
      data: requestBody,
      headers: requestHeaders,
      timeout: gatewayOptions.timeout,
      ...args,
    });
  };
