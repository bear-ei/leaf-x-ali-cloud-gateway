'use strict'

import * as crypto from 'crypto'

/**
 * Get request header options.
 */
export interface GetRequestHeaderOptions {
  /**
   * Ali cloud gateway application Key.
   */
  appKey: string
  /**
   * Gateway environment.
   */
  stage: string

  /**
   * Whether to enable anti-replay attacks.
   */
  nonce: boolean

  /**
   * Request entity.
   */
  body: unknown

  /**
   * Request Header.
   */
  headers: Record<string, string>
}

/**
 * Get request headers.
 */
export interface GetHeaderFunction {
  (options: GetRequestHeaderOptions): Record<string, string>
}

/**
 * Get token option.
 */
export interface GetTokenOptions {
  /**
   * Http request method.
   */
  method: string

  /**
   * Request Headers.
   */
  headers: Record<string, string>

  /**
   * Request url.
   */
  url: string

  /**
   * Ali cloud gateway application secret.
   *
   */
  appSecret: string
}

/**
 * Get token results.
 */
export interface GetTokenResult {
  /**
   * Gateway request header signature.
   *
   */
  'x-ca-signature': string

  /**
   * Request header fields for participating signatures.
   */
  'x-ca-signature-headers': string
}

/**
 * Get token.
 */
export interface GetTokenFunction {
  (options: GetTokenOptions): GetTokenResult
}

/**
 * Get canonical header results.
 */
export interface GetCanonicalHeaderResult {
  /**
   * Canonical header key collection.
   */
  canonicalHeaderKeys: string[]

  /**
   * Canonical header string.
   */
  canonicalHeaderString: string
}

/**
 * Get canonical header.
 *
 * @param prefix    Canonical header prefix.
 * @param headers   Request headers.
 */
export interface GetCanonicalHeaderFunction {
  (prefix: string, headers: Record<string, string>): GetCanonicalHeaderResult
}

/**
 * Get a signature.
 */
export interface GetSignFunction {
  (signString: string, appSecret: string): string
}

/**
 * md5.
 */
export interface MD5Function {
  (options: crypto.BinaryLike): string
}
