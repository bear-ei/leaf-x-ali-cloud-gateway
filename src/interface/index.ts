'use strict'

import { AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Gateway Options.
 */
export interface GatewayOptions {
  /**
   * Ali cloud gateway application Key.
   */
  appKey: string

  /**
   * Ali cloud gateway application secret.
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
   * Whether to enable anti-playback, default true.
   */
  nonce?: boolean

  /**
   * Default request headers.
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
export interface GatewayFunctionResult {
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
export interface GatewayFunction {
  (options: GatewayOptions): GatewayFunctionResult
}

/**
 * request.
 *
 * Axios-based implementation.
 */
export interface RequestFunction {
  (configs: GatewayOptions): (
    options: AxiosRequestConfig
  ) => Promise<AxiosResponse<unknown>>
}
