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
 * Initialize the signature.
 *
 * @param accessSecretKey   Ali cloud access key.
 * @return Sign
 */
export interface InitSign {
  (accessSecretKey: string): Sign;
}

/**
 * Signature.
 *
 * @param signString string
 * @return string
 */
export interface Sign {
  (signString: string): string;
}
