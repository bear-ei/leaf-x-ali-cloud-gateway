import fetch, {FetchOptions, handleRequestUrl} from '@leaf-x/fetch';
import {GatewayOptions} from './gateway';
import {headers as globalHeaders, initHandleRequestHeaders} from './headers';

/**
 * HTTP request method.
 */
export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'PUT'
  | 'PATCH'
  | 'PURGE'
  | 'LINK'
  | 'UNLINK';

/**
 * API gateway request options.
 */
export interface RequestOptions extends FetchOptions {
  /**
   *  Request API gateway host address.
   */
  host?: string;
}

/**
 * Request.
 *
 * @param url Request URL.
 * @param gatewayOptions API gateway options.
 * @param [options={}] API gateway request options.
 */
const request = (
  url: string,
  gatewayOptions: GatewayOptions,
  options: RequestOptions = {}
) => {
  const {
    method = 'GET',
    body,
    data,
    headers,
    params = {},
    host,
    ...args
  } = options;

  const requestBody = data ?? body;
  const requestUrl = handleRequestUrl(url, {params});
  const addHeaders = {} as Record<string, string>;

  for (const key of globalHeaders.keys()) {
    Object.assign(addHeaders, {[key]: globalHeaders.get(key)});
  }

  const handleRequestHeaders = initHandleRequestHeaders(gatewayOptions);
  const requestHeaders = handleRequestHeaders({
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

/**
 * Initialize the request function.
 *
 * @param gatewayOptions API gateway options.
 */
export const initRequest =
  (gatewayOptions: GatewayOptions) => (url: string, options?: RequestOptions) =>
    request(url, gatewayOptions, options);
