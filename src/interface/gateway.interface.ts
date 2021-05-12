import {Request} from './request.interface';

/**
 * Ali cloud gateway options.
 */
export interface GatewayOptions {
  /**
   * Gateway authorization application key.
   */
  appKey: string;

  /**
   * Gateway authorization application secret.
   */
  appSecret: string;

  /**
   * Gateway runtime environment.
   *
   * Default RELEASE
   */
  stage?: 'RELEASE' | 'PRE' | 'TEST';

  /**
   * Default global request headers.
   */
  headers?: Record<string, unknown>;
}

/**
 * Initialize the gateway result.
 */
export interface InitGatewayResult {
  /**
   * Request.
   */
  request: Request;
}

/**
 * Initialize the gateway.
 *
 * @param options GatewayOptions
 * @return InitGatewayResult
 */
export interface InitGateway {
  (options: GatewayOptions): InitGatewayResult;
}
