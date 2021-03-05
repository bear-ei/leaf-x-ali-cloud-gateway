import axios from 'axios'
import { GatewayFunction, RequestFunction } from './interface'
import { getRequestHeaders } from './util'
;('use strict')

export const gateway: GatewayFunction = (options) => {
  return { request: request(options) }
}

export const request: RequestFunction = ({
  appKey,
  appSecret,
  stage = 'RELEASE',
  nonce = true,
  defaultHeaders = {},
  baseUrl
}) => async ({ method = 'get', headers = {}, data, ...args }) => {
  const requestHeaders = getRequestHeaders(
    { appKey, stage, nonce, body: data },
    Object.assign({}, headers, defaultHeaders)
  )

  return axios.request({
    method,
    headers: Object.assign({}, requestHeaders, token),
    ...Object.assign({}, args, { baseURL: baseUrl })
  })
}
