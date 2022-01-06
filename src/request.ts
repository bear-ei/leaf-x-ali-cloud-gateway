import fetch, {
  FetchOptions,
  handleRequestUrl,
  HandleResponseResult,
} from '@leaf-x/fetch';
import {GatewayOptions} from './gateway';
import {headers as globalHeaders, initGetRequestHeaders} from './headers';

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
 * The request options.
 *
 * @extends FetchOptions
 */
export interface RequestOptions extends FetchOptions {
  /**
   * Request host.
   */
  host?: string;
}

/**
 * Request.
 *
 * @param url URL of the request.
 * @param options RequestOptions
 * @return Promise<HandleResponseResult>
 */
export interface Request {
  (url: string, options?: RequestOptions): Promise<HandleResponseResult>;
}

/**
 * The function that initialize the request.
 *
 * @param options GatewayOptions
 * @return Request
 */
export interface InitRequest {
  (options: GatewayOptions): Request;
}

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
