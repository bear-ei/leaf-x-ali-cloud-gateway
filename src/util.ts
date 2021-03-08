'use strict'

import * as crypto from 'crypto'
import * as uuid from 'uuid'
import {
  GetCanonicalHeaderFunction,
  GetHeaderFunction,
  GetSignFunction,
  GetTokenFunction,
  MD5Function
} from './interface/util'

export const getHeaders: GetHeaderFunction = ({
  appKey,
  stage,
  nonce,
  body,
  headers
}) => {
  const type = 'application/json; charset=UTF-8'
  const contentType = headers['content-type'] ?? type
  const data = contentType.startsWith('application/json')
    ? JSON.stringify(body)
    : body

  return {
    'x-ca-timestamp': Date.now().toString(),
    'x-ca-key': appKey,
    'x-ca-stage': stage,
    'content-type': contentType,
    'content-md5': data ? md5(data as crypto.BinaryLike).toString() : '',
    date: new Date().toUTCString(),
    accept: headers['accept'] ?? type,
    ...(nonce ? { 'x-ca-nonce': uuid.v4() } : undefined),
    ...headers
  }
}

export const getToken: GetTokenFunction = ({
  method,
  headers,
  url,
  appSecret
}) => {
  const { canonicalHeaderKeys, canonicalHeaderString } = getCanonicalHeaders(
    'x-ca-',
    headers
  )

  const headerString = [
    headers['date'],
    headers['accept'],
    headers['content-md5'],
    headers['content-type']
  ].join()

  const signString = [
    method,
    ...headerString,
    canonicalHeaderString,
    url
  ].join()

  return {
    'x-ca-signature': getSign(signString, appSecret),
    'x-ca-signature-headers': canonicalHeaderKeys.join()
  }
}

export const getCanonicalHeaders: GetCanonicalHeaderFunction = (
  prefix,
  headers
) => {
  const canonicalHeaders = (Object.keys(headers)
    .filter((key) => key.startsWith(prefix))
    .map((key) => ({ [key]: `${key}:${headers[key]}` })) as unknown) as Record<
    string,
    string
  >

  const canonicalHeaderKeys = Object.keys(canonicalHeaders).sort()
  const canonicalHeaderString = canonicalHeaderKeys
    .map((key) => canonicalHeaders[key])
    .join()

  return { canonicalHeaderKeys, canonicalHeaderString }
}

export const getSign: GetSignFunction = (signString, appSecret) => {
  const buffer = crypto
    .createHmac('sha256', appSecret)
    .update(signString, 'utf8')
    .digest()

  return Buffer.from(buffer).toString('base64')
}

export const md5: MD5Function = (data) =>
  crypto.createHash('md5').update(data).digest('hex')
