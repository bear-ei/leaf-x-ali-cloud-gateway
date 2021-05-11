import {FetchOptions} from '@leaf-x/fetch';
import {GatewayOptions} from './gateway.interface';

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
 * Get the request headers.
 *
 * @param options FetchOptions
 * @return Record<string, unknown>;
 */
export interface GetRequestHeaders {
  (options: FetchOptions): Record<string, unknown>;
}

/**
 * Get canonical request headers options.
 */
export interface GetCanonicalHeadersOptions {
  /**
   * Canonical headers prefix.
   */
  prefix: string;
}

/**
 * Get canonical request headers result.
 */
export interface GetCanonicalHeadersResult {
  /**
   * Canonical headers key string.
   */
  canonicalHeadersKeysString: string;

  /**
   * Canonical headers string.
   */
  canonicalHeadersString: string;
}

/**
 * Get the canonical headers.
 *
 * @param options GetCanonicalHeadersOptions
 * @param headers Request headers.
 * @return GetCanonicalHeadersResult
 */
export interface GetCanonicalHeaders {
  (
    options: GetCanonicalHeadersOptions,
    headers: Record<string, unknown>
  ): GetCanonicalHeadersResult;
}

/**
 * Initialize the splice canonical headers.
 *
 * @param headers Request headers.
 * @return SpliceCanonicalHeaders
 */
export interface InitSpliceCanonicalHeaders {
  (headers: Record<string, unknown>): SpliceCanonicalHeaders;
}

/**
 * Splice canonical headers.
 *
 * @param key Request headers key.
 * @return string
 */
export interface SpliceCanonicalHeaders {
  (key: string): string;
}
