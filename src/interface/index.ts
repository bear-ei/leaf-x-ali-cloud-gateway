'use strict'

import { AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Gateway Options.
 */
export interface GatewayOptions {
  /**
   * Ali cloud gateway application key.
   */
  appKey: string

  /**
   * Ali cloud gateway application secret.
   */
  appSecret: string

  /**
   * Request timeout time in milliseconds, default value 3000.
   */
  timeout?: number

  /**
   * Gateway Environment.
   *
   * RELEASE    Production environment.
   * TEST       Test environment.
   * PRE        Pre-release environment.
   */
  stage?: 'RELEASE' | 'TEST' | 'PRE'

  /**
   * Whether to enable anti-playback, default true.
   */
  nonce?: boolean

  /**
   * Default request headers.
   */
  defaultHeaders?: Record<string, unknown>

  /**
   * Base url.
   */
  baseUrl?: string

  /**
   * Request url.
   */
  url?: string
}

/**
 * Gateway result.
 */
export interface GatewayFunctionResult {
  /**
   * request.
   *
   * Axios-based implementation.
   */
  request: (
    path: string,
    options: AxiosRequestConfig
  ) => Promise<AxiosResponse<unknown>>
}

/**
 * Gateway.
 */
export interface GatewayFunction {
  (options: GatewayOptions): GatewayFunctionResult
}

/**
 * request.
 *
 * @param path Request path.
 */
export interface RequestFunction {
  (configs: GatewayOptions): (
    path: string,
    options: AxiosRequestConfig
  ) => Promise<AxiosResponse<unknown>>
}
