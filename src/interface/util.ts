'use strict'

/**
 * Md5 encoding.
 */
export interface Md5 {
  (data: string): string
}

/**
 * HmacSHA256 encoding.
 */
export interface HmacSHA256 {
  (secret: string, data: string): string
}

/**
 * Formatting headers.
 */
export interface FormatHeaders {
  (headers: Record<string, string>): Record<string, string>
}

/**
 * Header Options.
 */
export interface HeadersOptions {
  /**
   * Application key.
   */
  appKey: string

  /**
   * Gateway Environment.
   *
   * RELEASE    Production environment.
   * TEST       Test environment.
   * PRE        Pre-release environment.
   */
  stage: 'RELEASE' | 'TEST' | 'PRE'

  /**
   * Whether to turn on anti-replay.
   */
  nonce: boolean

  /**
   * Request Data.
   */
  data: unknown
}

/**
 * Headers.
 */
export interface Headers {
  (options: HeadersOptions, headers: Record<string, string>): Record<
    string,
    string
  >
}

/**
 * Url params result.
 */
export interface UrlParamsResult {
  href: string
  params: URLSearchParams
}

/**
 * Url params.
 */
export interface UrlParams {
  (httpUrl: string): UrlParamsResult
}

/**
 *  Params signature string.
 */
export interface ParamsSignString {
  (params: Record<string, unknown>, options: UrlParamsResult): string
}

/**
 * Signature Options.
 */
export interface SignOptions {
  /**
   * Http method.
   */
  method: string

  /**
   * headers.
   */
  headers: Record<string, string>

  /**
   * Params signature string.
   */
  paramsSignString: string
}

/**
 * Signature result.
 */
export interface SignResult {
  /**
   * Gateway signature.
   */
  'x-ca-signature': string

  /**
   * Request headers involved in the calculation of signatures.
   */
  'x-ca-signature-headers': string
}

/**
 * Signature.
 */
export interface Sign {
  (secret: string, options: SignOptions): SignResult
}

/**
 * Check if it is the correct url.
 */
export interface IsUrl {
  (url: string): URL | boolean
}
