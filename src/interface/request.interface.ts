import {FetchOptions, HandleResponseResult} from '@leaf-x/fetch';
import {GatewayOptions} from './gateway.interface';

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
 * Initialize the request.
 *
 * @param options GatewayOptions.
 * @return Request
 */
export interface InitRequest {
  (options: GatewayOptions): Request;
}

export interface RequestOptions extends FetchOptions {
  host?: string;
}

/**
 * Request.
 *
 * @param url Request URL address.
 * @param options RequestOptions
 * @return Promise<HandleResponseResult>
 */
export interface Request {
  (url: string, options?: RequestOptions): Promise<HandleResponseResult>;
}
