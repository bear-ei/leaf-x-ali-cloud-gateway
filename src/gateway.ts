import {headers} from './headers';
import {initRequest, Request} from './request';
import {initSocket, SocketOptions, SocketResult} from './socket';

/**
 * Gateway API options.
 */
export interface GatewayOptions {
  /**
   * Gateway application key.
   */
  appKey: string;

  /**
   * Gateway application secret.
   */
  appSecret: string;

  /**
   * Accesses the API gateway environment. default is RELEASE.
   */
  stage?: 'RELEASE' | 'PRE' | 'TEST';

  /**
   * Set the default request headers.
   */
  headers?: Record<string, string>;

  /**
   * Set the request timeout in milliseconds. The default timeout is 3000
   * milliseconds.
   */
  timeout?: number;

  /**
   * Socket options.
   */
  socketOptions?: SocketOptions;
}

/**
 * Result of the Gateway API.
 */
export interface GatewayResult {
  /**
   * Gateway request.
   */
  request: Request;

  /**
   * Gateway socket.
   */
  socket: SocketResult;

  /**
   * Gateway Request headers.
   */
  headers: Map<unknown, unknown>;
}

/**
 * Gateway API.
 *
 * @param options GatewayOptions
 * @return InitGatewayResult
 */
export interface Gateway {
  (options: GatewayOptions): GatewayResult;
}

export const gateway: Gateway = ({
  appKey,
  appSecret,
  stage = 'RELEASE',
  timeout = 3000,
  ...args
}) => {
  const options = {appKey, appSecret, stage, timeout, ...args};

  return Object.freeze({
    request: initRequest(options),
    socket: initSocket(options)(),
    headers,
  });
};
