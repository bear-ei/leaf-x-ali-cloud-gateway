'use strict'

import axios from 'axios'
import { GatewayFunction, RequestFunction } from './interface'
import { getHeaders, getToken } from './util'

export const gateway: GatewayFunction = (options) => {
  return { request: request(options) }
}

export const request: RequestFunction = ({
  appKey,
  appSecret,
  stage = 'RELEASE',
  nonce = true,
  defaultHeaders = {},
  timeout = 30000,
  baseUrl
}) => async (path, { method = 'get', headers = {}, data, ...args }) => {
  const requestHeaders = getHeaders({
    appKey,
    stage,
    nonce,
    body: data,
    headers: Object.assign({}, headers, defaultHeaders)
  })

  const url = (baseUrl ? `${baseUrl}/${path}` : path) as string
  const token = getToken({
    method,
    headers: requestHeaders,
    url,
    appSecret
  })

  return axios.request({
    method,
    timeout,
    headers: Object.assign({}, requestHeaders, token),
    url,
    ...args
  })
}
