import {FetchOptions} from '@leaf-x/fetch';
import * as crypto from 'crypto';
import * as uuid from 'uuid';
import {GatewayOptions} from './gateway';
import {HttpMethod} from './request';
import {getToken} from './token';

/**
 * Get options for the request headers.
 *
 * @extends FetchOptions
 */
export interface GetHeadersOptions extends FetchOptions {
  /**
   * Request host.
   */
  host?: string;
}

/**
 * Get the headers.
 *
 * @param options GetHeadersOptions
 * @return Record<string, string>
 */
export interface GetHeaders {
  (options: GetHeadersOptions): Record<string, string>;
}

/**
 * Initialize the function that gets the headers.
 *
 * @param options GatewayOptions
 * @return GetHeaders
 */
export interface InitGetHeaders {
  (options: GatewayOptions): GetHeaders;
}

/**
 * Get options for the canonical request headers.
 */
export interface GetCanonicalHeadersOptions {
  /**
   * Canonical request headers prefix.
   */
  prefix: string;
}

/**
 * Get the result of the canonical request headers.
 */
export interface GetCanonicalHeadersResult {
  /**
   * Canonical request headers key string.
   */
  canonicalHeadersKeysString: string;

  /**
   * Canonical request headers string.
   */
  canonicalHeadersString: string;
}

/**
 * Get the canonical request headers.
 *
 * @param options GetCanonicalHeadersOptions
 * @param headers Request headers.
 * @return GetCanonicalHeadersResult
 */
export interface GetCanonicalHeaders {
  (
    options: GetCanonicalHeadersOptions,
    headers: Record<string, string>
  ): GetCanonicalHeadersResult;
}

/**
 * Get options for the request headers.
 *
 * @extends FetchOptions
 */
export interface GetRequestHeadersOptions extends FetchOptions {
  /**
   * URL of the request.
   */
  url: string;

  /**
   * Request host.
   */
  host?: string;
}

/**
 * Get the request headers.
 *
 * @param options GetRequestHeadersOptions
 * @return Record<string, string>
 */
export interface GetRequestHeaders {
  (options: GetRequestHeadersOptions): Record<string, string>;
}

/**
 * Initialize the function that gets the request headers.
 *
 * @param options GatewayOptions
 * @return GetRequestHeaders
 */
export interface InitGetRequestHeaders {
  (options: GatewayOptions): GetRequestHeaders;
}

const HEADERS = new Map();
const initGetHeaders: InitGetHeaders =
  ({appKey, stage, headers: defaultHeaders}) =>
  ({headers, data, host}) => {
    const isJson = typeof data === 'object' && data !== null;
    const contentMD5 = data
      ? crypto
          .createHash('md5')
          .update((isJson ? JSON.stringify(data) : `${data}`) as string)
          .digest('base64')
      : '';

    return {
      'x-ca-nonce': uuid.v4(),
      'x-ca-timestamp': `${Date.now()}`,
      'x-ca-key': appKey,
      'x-ca-stage': stage as string,
      'content-type':
        (headers as Record<string, string>)?.['content-type'] ??
        'application/json; charset=utf-8',
      'content-md5': contentMD5,
      accept: (headers as Record<string, string>)?.accept ?? '*/*',
      date: '',
      ...(host ? {host} : undefined),
      ...defaultHeaders,
      ...(headers as Record<string, string>),
    };
  };

export const getCanonicalHeaders: GetCanonicalHeaders = ({prefix}, headers) => {
  const canonicalHeadersKeys = Object.keys(headers)
    .filter(key => key.startsWith(prefix))
    .sort();

  return {
    canonicalHeadersKeysString: canonicalHeadersKeys.join(),
    canonicalHeadersString: canonicalHeadersKeys
      .map(key => `${key}:${headers[key]}`)
      .join('\n'),
  };
};

export const initGetRequestHeaders: InitGetRequestHeaders =
  gatewayOptions =>
  ({host, headers, data, url, method = 'GET'}) => {
    const requestHeaders = initGetHeaders(gatewayOptions)({
      headers,
      data,
      host,
    });

    const {canonicalHeadersKeysString, sign} = getToken({
      url,
      secret: gatewayOptions.appSecret,
      method: method.toLocaleUpperCase() as HttpMethod,
      headers: requestHeaders,
    });

    return {
      ...requestHeaders,
      'x-ca-signature': sign,
      'x-ca-signature-headers': canonicalHeadersKeysString,
    };
  };

export {HEADERS as headers};
