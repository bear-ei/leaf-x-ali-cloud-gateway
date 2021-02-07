'use strict'

import { AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Gateway options.
 */
export interface GatewayOptions {
  /**
   * Application key.
   */
  appKey: string

  /**
   * Application secret.
   */
  appSecret: string

  /**
   * Gateway Environment.
   *
   * RELEASE    Production environment.
   * TEST       Test environment.
   * PRE        Pre-release environment.
   */
  stage?: 'RELEASE' | 'TEST' | 'PRE'

  /**
   * Whether to turn on anti-replay.
   */
  nonce?: boolean

  /**
   * Default request header.
   */
  defaultHeaders?: Record<string, unknown>

  /**
   * The base url is automatically prepended to the url, unless the url is an absolute url.
   */
  baseUrl?: string
}

/**
 * Gateway result.
 */
export interface GatewayResult {
  /**
   * request.
   *
   * Axios-based implementation.
   */
  request: Request
}

/**
 * Gateway.
 */
export interface Gateway {
  (options: GatewayOptions): GatewayResult
}

/**
 * request.
 *
 * Axios-based implementation.
 */
export interface Request {
  (gatewayOptions: GatewayOptions, options: AxiosRequestConfig): Promise<
    AxiosResponse<unknown>
  >
}
