import {HttpMethod} from './request.interface';

/**
 * Get token options.
 */
export interface GetTokenOptions {
  /**
   * Ali cloud secret.
   */
  secret: string;

  /**
   * HTTP request method.
   */
  method: HttpMethod;

  /**
   * Request URL address.
   */
  url: string;

  /**
   * Request headers.
   */
  headers: Record<string, unknown>;
}

export interface GetTokenResult {
  canonicalHeadersKeysString: string;
  sign: string;
}

/**
 * Get token.
 *
 * @param options GetTokenOptions
 * @return GetTokenResult
 */
export interface GetToken {
  (options: GetTokenOptions): GetTokenResult;
}

/**
 * Get signature string options.
 */
export interface GetSignStringOptions {
  /**
   * HTTP request method.
   */
  method: HttpMethod;

  /**
   * Request URL address.
   */
  url: string;

  /**
   * Request headers.
   */
  headers: Record<string, unknown>;
}

export interface GetSignStringResult {
  canonicalHeadersKeysString: string;
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
 * Signature options.
 */
export interface SignOptions {
  /**
   * Signature string.
   */
  signString: string;

  /**
   * Secret key.
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
