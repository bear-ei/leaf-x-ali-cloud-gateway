import {Request} from './request.interface';
import {Socket, SocketOptions} from './socket.interface';

/**
 * Gateway options.
 */
export interface GatewayOptions {
  /**
   * Application key.
   */
  appKey: string;

  /**
   * Application secret key.
   */
  appSecret: string;

  /**
   * Access to the API gateway environment.
   */
  stage?: 'RELEASE' | 'PRE' | 'TEST';

  /**
   * Default request headers.
   */
  headers?: Record<string, string>;

  /**
   * Request timeout, in milliseconds.
   */
  timeout?: number;

  /**
   * Socket options.
   */
  socketOptions?: SocketOptions;
}

/**
 * Initialize the gateway result.
 */
export interface InitGatewayResult {
  /**
   * Gateway request.
   */
  request: Request;

  /**
   * Socket.
   */
  socket: Socket;
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
