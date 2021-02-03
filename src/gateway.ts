'use strict'

import axios from 'axios'
import * as uuid from 'uuid'
import * as crypto from 'crypto-js'
import {
  FormatDataFunction,
  GatewayOptions,
  HmacSHA256Function,
  Md5Function,
  RequestFunction
} from './interface/gateway'

export const gateway = ({
  appKey,
  appSecret,
  stage = 'RELEASE',
  nonce = true
}: GatewayOptions) => {
  const APP_KEY = appKey
  const APP_SECRET = appSecret
  const STAGE = stage
  const NONCE = nonce

  const request: RequestFunction = async ({ method, headers }) => {
    return axios.request({})
  }

  return { request }
}

const formatData: FormatDataFunction = (data) =>
  typeof data === 'object' && data !== null ? JSON.stringify(data) : `${data}`

const md5: Md5Function = (data) => crypto.MD5(data).toString(crypto.enc.Base64)
const hmacSHA256: HmacSHA256Function = (appSecret, data) =>
  crypto.HmacSHA256(data, appSecret).toString(crypto.enc.Base64)

const formatHeaders = (headers) =>
  Object.keys(headers)
    .map((key) => ({ [key]: headers[key] }))
    .reduce((a, b) => Object.assign(a, b), {})

const buildHeaders = ({ appKey, stage, nonce }, { data, headers }) => {
  const type = 'application/json; charset=UTF-8'
  const formatDataResult = formatData(data)
  const contentMd5 = md5(formatDataResult)
  const contentType = headers['content-type'] ? headers['content-type'] : type
  const accept = headers['accept'] ? headers['accept'] : type

  return {
    'x-ca-timestamp': Date.now().toString(),
    'x-ca-key': appKey,
    'x-ca-stage': stage,
    'content-type': contentType,
    'content-md5': contentMd5,
    accept,
    ...(nonce ? { 'x-ca-nonce': uuid.v4() } : undefined)
  }
}
