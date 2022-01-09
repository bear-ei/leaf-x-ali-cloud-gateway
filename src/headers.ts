import {FetchOptions} from '@leaf-x/fetch';
import * as crypto from 'crypto';
import * as uuid from 'uuid';
import {GatewayOptions} from './gateway';
import {HttpMethod} from './request';
import {handleToken} from './token';

/**
 * Handle headers options.
 */
export interface HandleHeadersOptions extends FetchOptions {
  /**
   *  Request API gateway host address.
   */
  host?: string;
}

/**
 * Handle request headers options.
 */
export interface HandleRequestHeadersOptions extends FetchOptions {
  /**
   * Request URL.
   */
  url: string;

  /**
   *  Request API gateway host address.
   */
  host?: string;
}

/**
 * Set the global request headers information.
 */
const HEADERS = new Map();

/**
 * Handle headers information.
 *
 * @param options Handle request headers options.
 * @param gatewayOptions API gateway options.
 */
const handleHeaders = (
  {headers, data, host}: HandleHeadersOptions,
  {appKey, stage, headers: defaultHeaders}: GatewayOptions
) => {
  const relHeaders = headers as Record<string, string>;
  const isJson = typeof data === 'object' && data !== null;
  const relData = isJson ? JSON.stringify(data) : data?.toString();

  const contentMD5 = relData
    ? crypto.createHash('md5').update(relData).digest('base64')
    : '';

  return {
    'x-ca-nonce': uuid.v4(),
    'x-ca-timestamp': `${Date.now()}`,
    'x-ca-key': appKey,
    'x-ca-stage': stage as string,
    'content-type':
      relHeaders?.['content-type'] ?? 'application/json; charset=utf-8',
    'content-md5': contentMD5,
    accept: relHeaders?.accept ?? '*/*',
    date: '',
    ...(host ? {host} : undefined),
    ...defaultHeaders,
    ...relHeaders,
  };
};

/**
 * Initialize the function that handle the headers.
 *
 * @param gatewayOptions API gateway options.
 */
const initHandleHeaders =
  (gatewayOptions: GatewayOptions) => (options: HandleHeadersOptions) =>
    handleHeaders(options, gatewayOptions);

/**
 * Handle canonical request headers.
 *
 * @param prefix Canonical request headers prefix.
 * @param headers Request headers information.
 */
export const handleCanonicalHeaders = (
  prefix: string,
  headers: Record<string, string>
) => {
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

/**
 * Handle the request headers information.
 *
 * @param options Handle request headers options.
 * @param gatewayOptions API gateway options.
 */
const handleRequestHeaders = (
  {host, headers, data, url, method = 'GET'}: HandleRequestHeadersOptions,
  gatewayOptions: GatewayOptions
) => {
  const headersFun = initHandleHeaders(gatewayOptions);
  const requestHeaders = headersFun({
    headers,
    data,
    host,
  });

  const {canonicalHeadersKeysString, sign} = handleToken({
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

/**
 * Initialize the function that handle the request headers.
 *
 * @param gatewayOptions API gateway options.
 */
export const initHandleRequestHeaders =
  (gatewayOptions: GatewayOptions) => (options: HandleRequestHeadersOptions) =>
    handleRequestHeaders(options, gatewayOptions);

export {HEADERS as headers};
