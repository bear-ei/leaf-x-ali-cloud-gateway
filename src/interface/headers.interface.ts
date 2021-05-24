import {FetchOptions} from '@leaf-x/fetch';
import {GatewayOptions} from './gateway.interface';

/**
 * Initialize the get request headers.
 *
 * @param options GatewayOptions
 * @return GetHeaders
 */
export interface InitGetHeaders {
  (options: GatewayOptions): GetHeaders;
}

/**
 * Get request headers options.
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
 * Get the request headers.
 *
 * @param options GetHeadersOptions
 * @return Record<string, string>
 */
export interface GetHeaders {
  (options: GetHeadersOptions): Record<string, string>;
}

/**
 * Initialize the get request headers.
 *
 * @param options GatewayOptions
 * @return GetRequestHeaders
 */
export interface InitGetRequestHeaders {
  (options: GatewayOptions): GetRequestHeaders;
}

/**
 * Get request headers options.
 *
 * @extends FetchOptions
 */
export interface GetRequestHeadersOptions extends FetchOptions {
  /**
   * Request URL.
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
 * Get canonical request header options.
 */
export interface GetCanonicalHeadersOptions {
  /**
   * Canonical request header prefix.
   */
  prefix: string;
}

/**
 * Get canonical request header result.
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
 * Get canonical request headers.
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
