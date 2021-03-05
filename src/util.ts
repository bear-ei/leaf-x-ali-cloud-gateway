import * as crypto from 'crypto'
import * as uuid from 'uuid'
import { GetRequestHeaderFunction, MD5Function } from './interface/util'

export const getHeaders: GetRequestHeaderFunction = (
  { appKey, stage, nonce, body },
  headers
) => {
  const type = 'application/json; charset=UTF-8'
  const contentType = headers['content-type'] ?? type
  const data = contentType.startsWith('application/json')
    ? JSON.stringify(body)
    : body

  return {
    'x-ca-timestamp': Date.now().toString(),
    'x-ca-key': appKey,
    'x-ca-stage': stage,
    'content-type': headers['content-type'] ?? type,
    'content-md5': data ? md5(data as crypto.BinaryLike).toString() : '',
    date: new Date().toUTCString(),
    accept: headers['accept'] ?? type,
    ...(nonce ? { 'x-ca-nonce': uuid.v4() } : undefined),
    ...headers
  }
}

export const getToken = ({ method, headers, url, appSecret }) => {
  const { canonicalHeaderKeys, canonicalHeaderStr } = getCanonicalHeaders(
    headers,
    'x-ca-'
  )

  const headerStr = [
    headers['date'],
    headers['accept'],
    headers['content-md5'],
    headers['content-type']
  ].join()

  const signStr = [method, ...headerStr, canonicalHeaderStr, url].join()

  return {
    'x-ca-signature': getSign(signStr, appSecret),
    'x-ca-signature-headers': canonicalHeaderKeys.join()
  }
}

export const getCanonicalHeaders = (
  headers: Record<string, string>,
  prefix: string
) => {
  const canonicalHeaders = (Object.keys(headers)
    .filter((key) => key.startsWith(prefix))
    .map((key) => ({ [key]: `${key}:${headers[key]}` })) as unknown) as Record<
    string,
    string
  >

  const canonicalHeaderKeys = Object.keys(canonicalHeaders).sort()
  const canonicalHeaderStr = canonicalHeaderKeys.map(
    (key) => canonicalHeaders[key]
  )

  return { canonicalHeaderKeys, canonicalHeaderStr }
}

export const getSign = (signStr: string, appSecret: string) => {
  const buffer = crypto
    .createHmac('sha256', appSecret)
    .update(signStr, 'utf8')
    .digest()

  return Buffer.from(buffer).toString('base64')
}

export const md5: MD5Function = (data) =>
  crypto.createHash('md5').update(data).digest('hex')
