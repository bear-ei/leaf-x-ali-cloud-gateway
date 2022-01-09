import * as crypto from 'crypto';
import {handleCanonicalHeaders} from './headers';
import {HttpMethod} from './request';

/**
 * Signature options.
 */
export interface SignOptions {
  /**
   * Signature string.
   */
  signString: string;

  /**
   * API gateway access key.
   */
  secret: string;
}

/**
 * Handle signature string options.
 */
export interface HandleSignStringOptions {
  /**
   * HTTP request method.
   */
  method: HttpMethod;

  /**
   * Request URL.
   */
  url: string;

  /**
   * Request headers information.
   */
  headers: Record<string, string>;
}

/**
 * Handle the request token options.
 */
export interface HandleTokenOptionsOptions {
  /**
   * API gateway access key.
   */
  secret: string;

  /**
   * HTTP request method.
   */
  method: HttpMethod;

  /**
   * Request URL.
   */
  url: string;

  /**
   * Request headers information.
   */
  headers: Record<string, string>;
}

/**
 * Signature.
 *
 * @param options Signature options.
 */
const sign = ({secret, signString}: SignOptions) =>
  crypto
    .createHmac('sha256', secret)
    .update(signString, 'utf8')
    .digest('base64');

/**
 * Handle signature strings.
 *
 * @param options Handle signature string options.
 */
const handleSignString = ({method, url, headers}: HandleSignStringOptions) => {
  const {searchParams, pathname} = new URL(url);
  const queryParams = {} as Record<string, unknown>;
  const {canonicalHeadersKeysString, canonicalHeadersString} =
    handleCanonicalHeaders(
      /** Canonical request headers prefix. */ 'x-ca-',
      headers
    );

  for (const key of searchParams.keys()) {
    Object.assign(queryParams, {[key]: searchParams.get(key)});
  }

  const paramsString = Object.keys(queryParams)
    .sort()
    .map(key => `${key}=${queryParams[key]}`)
    .join('&');

  return {
    canonicalHeadersKeysString,
    signString: [
      method,
      headers['accept'],
      headers['content-md5'],
      headers['content-type'],
      headers['date'],
      canonicalHeadersString,
      encodeURI(paramsString ? `${pathname}?${paramsString}` : pathname),
    ].join('\n'),
  };
};

/**
 * Handle the request token.
 *
 * @param options Handle the request token options.
 */
export const handleToken = ({secret, ...args}: HandleTokenOptionsOptions) => {
  const {canonicalHeadersKeysString, signString} = handleSignString(args);

  return {
    canonicalHeadersKeysString,
    sign: sign({secret, signString}),
  };
};
