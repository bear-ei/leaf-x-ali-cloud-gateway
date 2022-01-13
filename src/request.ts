import fetch, {FetchOptions, handleRequestUrl} from '@leaf-x/fetch';
import {GatewayOptions} from './gateway';
import {initHandleRequestHeaders} from './headers';

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
 * Request options.
 */
export interface RequestOptions extends FetchOptions {
  /**
   * Request host address.
   */
  host?: string;
}

/**
 * Initiate a network request.
 *
 * @param url Request URL.
 * @param initRequestOptions API gateway options.
 * @param [options={}] Request options.
 */
const request = (
  url: string,
  gatewayOptions: GatewayOptions,
  options: RequestOptions = {}
) => {
  const {method = 'GET', body, data, headers, params, host, ...args} = options;
  const handleRequestHeaders = initHandleRequestHeaders(gatewayOptions);
  const requestBody = data ?? body;
  const requestUrl = handleRequestUrl(url, {params});
  const requestHeaders = handleRequestHeaders({
    url: requestUrl,
    method,
    data: requestBody,
    headers,
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
 * Initialization request.
 *
 * @param gatewayOptions API gateway options.
 */
export const initRequest =
  (gatewayOptions: GatewayOptions) => (url: string, options?: RequestOptions) =>
    request(url, gatewayOptions, options);
