'use strict'

import * as _ from 'ramda'
import * as crypto from 'crypto'
import * as uuid from 'uuid'
import {
  HmacSHA256,
  Md5,
  FormatHeaders,
  Headers,
  UrlParams,
  ParamsSignString,
  Sign,
  IsUrl
} from './interface/util'

export const md5: Md5 = (data) =>
  crypto.createHash('md5').update(data).digest('base64')

export const hmacSHA256: HmacSHA256 = (secret, data) =>
  crypto.createHmac('SHA256', secret).update(data).digest('base64')

export const formatHeaders: FormatHeaders = (headers) => {
  const lowerHeader = _.curry(
    (headers: Record<string, string>, key: string): Record<string, string> => ({
      [_.toLower(key)]: headers[key]
    })
  )(headers)

  return _.compose(
    _.reduce((a, b) => Object.assign(a, b), {} as Record<string, string>),
    _.map(lowerHeader),
    _.keys
  )(headers)
}

export const headers: Headers = ({ appKey, stage, nonce, data }, headers) => {
  const type = 'application/json; charset=UTF-8'

  return {
    'x-ca-timestamp': _.toString(Date.now()),
    'x-ca-key': appKey,
    'x-ca-stage': stage,
    'content-type': headers['content-type'] ?? type,
    'content-md5': _.compose(md5, _.toString)(data),
    date: '',
    accept: headers['accept'] ?? type,
    ...(nonce ? { 'x-ca-nonce': uuid.v4() } : undefined),
    ...headers
  }
}

export const urlParams: UrlParams = (httpUrl) => {
  const url = new URL(httpUrl)

  return { href: url.href, params: url.searchParams }
}

export const paramsSignString: ParamsSignString = (
  params,
  { params: urlParams, href }
): string => {
  const searchParams = Object.assign({}, params, urlParams)
  const joinString = _.curry(
    (params: Record<string, unknown>, key: string): string =>
      _.join('=', [key, params[key]])
  )(searchParams)

  const queryString = _.compose(
    _.join('&'),
    _.map(joinString),
    _.sort((a, b) => a.localeCompare(b)),
    _.keys
  )

  return _.compose(_.join('?'))([href, queryString(searchParams)])
}

export const sign: Sign = (secret, { method, headers, paramsSignString }) => {
  const stringSort = (a, b) => a.localeCompare(b)
  const filterHeaders = (key: string) => {
    switch (key) {
      case 'date':
      case 'accept':
      case 'content-md5':
      case 'content-type':
        return true
      default:
        return false
    }
  }

  const headersValues = _.curry(
    (obj: Record<string, string>, key: string) => obj[key]
  )(headers)

  const canonicalHeadersKeys = _.compose(
    _.filter((key: string) => key.startsWith('x-ca-')),
    _.keys
  )(headers)

  const canonicalHeaders = _.curry((headers, key) => `${key}:${headers[key]}`)(
    headers
  )

  const canonicalHeaderString = _.compose(
    _.join('\n'),
    _.map(canonicalHeaders),
    _.sort(stringSort)
  )(canonicalHeadersKeys)

  const headerSignString = _.compose(
    _.join('\n'),
    _.map(headersValues),
    _.sort(stringSort),
    _.filter(filterHeaders),
    _.keys
  )(headers)

  const sign = _.curry(hmacSHA256)(secret)

  return {
    'x-ca-signature': _.compose(
      sign,
      _.join('\n')
    )([method, headerSignString, canonicalHeaderString, paramsSignString]),
    'x-ca-signature-headers': _.join('')(canonicalHeadersKeys)
  }
}

export const isUrl: IsUrl = (url) => {
  try {
    return new URL(url)
  } catch (error) {
    return false
  }
}
