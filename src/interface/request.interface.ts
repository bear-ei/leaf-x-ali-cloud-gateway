import {FetchOptions, HandleResponseResult} from '@leaf-x/fetch';

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
 * Request.
 *
 * @param url Request URL address.
 * @param options FetchOptions
 * @return Promise<HandleResponseResult>
 */
export interface Request {
  (url: string, options?: FetchOptions): Promise<HandleResponseResult>;
}
