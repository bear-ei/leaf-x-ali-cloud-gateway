'use strict'

import * as _ from 'ramda'
import axios from 'axios'
import { Gateway, Request } from './interface/gateway'
import {
  formatHeaders,
  paramsSignString,
  urlParams,
  headers as generateHeaders,
  sign,
  isUrl
} from './util'

const IMPURE = { axios }

export const gateway: Gateway = (options) => {
  return { request: _.curry(request)(options) }
}

const request: Request = async (
  {
    appKey,
    appSecret,
    stage = 'RELEASE',
    nonce = true,
    defaultHeaders = {},
    baseUrl
  },
  { method = 'get', url, headers = {}, data, params = {}, ...args }
) => {
  const requestUrl = url
    ? baseUrl
      ? isUrl(url)
        ? url
        : `${baseUrl}${url}`
      : url
    : baseUrl
    ? baseUrl
    : ''
  const handleHeaders = _.curry(generateHeaders)({
    appKey,
    stage,
    nonce,
    data
  })

  const handleParamsSignString = _.curry(paramsSignString)(params)
  const requestHeaders = _.compose(
    handleHeaders,
    formatHeaders
  )(Object.assign({}, headers, defaultHeaders))

  const signString = _.compose(handleParamsSignString, urlParams)(requestUrl)
  const token = _.curry(sign)(appSecret)({
    method,
    headers: requestHeaders,
    paramSignString: signString
  })

  return IMPURE.axios.request({
    method,
    headers: Object.assign({}, requestHeaders, token),
    ...Object.assign({}, args, { baseURL: baseUrl })
  })
}
