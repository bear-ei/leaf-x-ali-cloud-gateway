import * as crypto from 'crypto'
;('use strict')

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
   * Request unique string identification.
   */
  nonce: string

  /**
   * Request entity.
   */
  body: unknown
}

export interface GetRequestHeaderFunction {
  (options: GetRequestHeaderOptions, headers: Record<string, string>): Record<
    string,
    string
  >
}

/**
 * md5.
 */
export interface MD5Function {
  (options: crypto.BinaryLike): string
}

export interface IsUrlFunction {
  (url: string): boolean
}
