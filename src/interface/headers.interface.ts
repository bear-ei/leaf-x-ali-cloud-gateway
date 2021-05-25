import {FetchOptions} from '@leaf-x/fetch';
import {GatewayOptions} from './gateway.interface';

/**
 * Initialize the function that gets the headers.
 *
 * @param options GatewayOptions
 * @return GetHeaders
 */
export interface InitGetHeaders {
  (options: GatewayOptions): GetHeaders;
}

/**
 * Get options for the request headers.
 *
 * @extends FetchOptions
 */
export interface GetHeadersOptions extends FetchOptions {
  /**
   * Request host.
   */
  host?: string;
}

/**
 * Get the headers.
 *
 * @param options GetHeadersOptions
 * @return Record<string, string>
 */
export interface GetHeaders {
  (options: GetHeadersOptions): Record<string, string>;
}

/**
 * Initialize the function that gets the request headers.
 *
 * @param options GatewayOptions
 * @return GetRequestHeaders
 */
export interface InitGetRequestHeaders {
  (options: GatewayOptions): GetRequestHeaders;
}

/**
 * Get options for the request headers.
 *
 * @extends FetchOptions
 */
export interface GetRequestHeadersOptions extends FetchOptions {
  /**
   * URL of the request.
   */
  url: string;

  /**
   * Request host.
   */
  host?: string;
}

/**
 * Get the request headers.
 *
 * @param options GetRequestHeadersOptions
 * @return Record<string, string>
 */
export interface GetRequestHeaders {
  (options: GetRequestHeadersOptions): Record<string, string>;
}

/**
 * Get options for the canonical request headers.
 */
export interface GetCanonicalHeadersOptions {
  /**
   * Canonical request headers prefix.
   */
  prefix: string;
}

/**
 * Get the result of the canonical request headers.
 */
export interface GetCanonicalHeadersResult {
  /**
   * Canonical request headers key string.
   */
  canonicalHeadersKeysString: string;

  /**
   * Canonical request headers string.
   */
  canonicalHeadersString: string;
}

/**
 * Get the canonical request headers.
 *
 * @param options GetCanonicalHeadersOptions
 * @param headers Request headers.
 * @return GetCanonicalHeadersResult
 */
export interface GetCanonicalHeaders {
  (
    options: GetCanonicalHeadersOptions,
    headers: Record<string, string>
  ): GetCanonicalHeadersResult;
}
