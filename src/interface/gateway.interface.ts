import {Request} from './request.interface';
import {SocketOptions} from './socket/socket.interface';

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
   * Set the global request headers.
   */
  headers?: Record<string, unknown>;

  /**
   * Set the global request timeout.
   *
   * Default 3000ms
   */
  timeout?: number;

  /**
   * Socket options.
   */
  socket?: SocketOptions;
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
