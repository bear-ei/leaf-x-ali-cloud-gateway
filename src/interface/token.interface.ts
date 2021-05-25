import {HttpMethod} from './request.interface';

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
