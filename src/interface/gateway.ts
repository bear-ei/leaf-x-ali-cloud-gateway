'use strict'

import { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface GatewayOptions {
  appKey: string

  appSecret: string

  stage?: string

  nonce?: boolean
}

export interface FormatDataFunction {
  (data: unknown): string
}

export interface Md5Function {
  (data: string): string
}

export interface HmacSHA256Function {
  (appSecret: string, data: string): string
}

export interface RequestFunction {
  (options: AxiosRequestConfig): Promise<AxiosResponse<unknown>>
}
