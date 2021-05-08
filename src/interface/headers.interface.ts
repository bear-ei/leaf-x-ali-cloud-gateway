import {FetchOptions} from '@leaf-x/fetch';
import {GatewayOptions} from './gateway.interface';

export interface InitGetRequestHeaders {
  (options: GatewayOptions): GetRequestHeaders;
}

/**
 * Get the request headers.
 *
 * @param options FetchOptions
 * @return Record<string, string>
 */
export interface GetRequestHeaders {
  (options: FetchOptions): Record<string, unknown>;
}

export interface GetCanonicalHeadersResult {
  canonicalHeadersKeysString: string;
  canonicalHeadersString: string;
}

/**
 * Canonical headers prefix options.
 */
export interface PrefixOptions {
  /**
   * Canonical headers prefix.
   */
  prefix: string;
}

/**
 * Get the canonical request string.
 *
 * @param prefixOptions     PrefixOptions
 * @param headers           Request headers.
 * @return GetCanonicalHeadersResult
 */
export interface GetCanonicalHeaders {
  (
    prefixOptions: PrefixOptions,
    headers: Record<string, unknown>
  ): GetCanonicalHeadersResult;
}

/**
 * Initialize the splice canonical request headers.
 *
 * @param headers Request headers.
 * @return SpliceCanonicalHeaders
 */
export interface InitSpliceCanonicalHeaders {
  (headers: Record<string, unknown>): SpliceCanonicalHeaders;
}

/**
 * Splice canonical request headers.
 *
 * @param key Canonical request header key.
 * @return string
 */
export interface SpliceCanonicalHeaders {
  (key: string): string;
}
