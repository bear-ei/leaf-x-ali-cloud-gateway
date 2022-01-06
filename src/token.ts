import * as crypto from 'crypto';
import {getCanonicalHeaders} from './headers';
import {HttpMethod} from './request';

/**
 * The options to sign.
 */
export interface SignOptions {
  /**
   * Signature string.
   */
  signString: string;

  /**
   * Gateway application secret.
   */
  secret: string;
}

/**
 * Signature.
 *
 * @param options SignOptions
 * @return string
 */
export interface Sign {
  (options: SignOptions): string;
}

/**
 * The options to get the signature string.
 */
export interface GetSignStringOptions {
  /**
   * HTTP request method.
   */
  method: HttpMethod;

  /**
   * URL of the request.
   */
  url: string;

  /**
   * Request headers.
   */
  headers: Record<string, string>;
}

/**
 * Get the result of the signature string.
 */
export interface GetSignStringResult {
  /**
   * Canonical of request header key string.
   */
  canonicalHeadersKeysString: string;

  /**
   * Signature string.
   */
  signString: string;
}

/**
 * Get the signature string.
 *
 * @param options GetSignStringOptions
 * @return GetSignStringResult
 */
export interface GetSignString {
  (options: GetSignStringOptions): GetSignStringResult;
}

/**
 * The options to get the request token.
 */
export interface GetTokenOptions {
  /**
   * Gateway application secret.
   */
  secret: string;

  /**
   * HTTP request method.
   */
  method: HttpMethod;

  /**
   * URL of the request.
   */
  url: string;

  /**
   * Request headers.
   */
  headers: Record<string, string>;
}

/**
 * Get the result of the request token.
 */
export interface GetTokenResult {
  /**
   * Canonical of request header key string.
   */
  canonicalHeadersKeysString: string;

  /**
   * Request a signature.
   */
  sign: string;
}

/**
 * Get the request token.
 *
 * @param options GetTokenOptions
 * @return GetTokenResult
 */
export interface GetToken {
  (options: GetTokenOptions): GetTokenResult;
}

const sign: Sign = ({secret, signString}) =>
  crypto
    .createHmac('sha256', secret)
    .update(signString, 'utf8')
    .digest('base64');

const getSignString: GetSignString = ({method, url, headers}) => {
  const {searchParams, pathname} = new URL(url);
  const queryParams = {} as Record<string, unknown>;
  const {canonicalHeadersKeysString, canonicalHeadersString} =
    getCanonicalHeaders({prefix: 'x-ca-'}, headers);

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

export const getToken: GetToken = ({secret, ...args}) => {
  const {canonicalHeadersKeysString, signString} = getSignString(args);

  return {
    canonicalHeadersKeysString,
    sign: sign({secret, signString}),
  };
};
