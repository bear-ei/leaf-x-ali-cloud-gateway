import {headers} from './headers';
import {initRequest} from './request';
import {initSocket, SocketOptions} from './socket';

/**
 * API gateway options.
 */
export interface GatewayOptions {
  /**
   * Authorized application key.
   */
  appKey: string;

  /**
   * Authorized application secret key.
   */
  appSecret: string;

  /**
   * API gateway request environment, the default is RELEASE.
   */
  stage?: 'RELEASE' | 'PRE' | 'TEST';

  /**
   * API gateway request header information.
   */
  headers?: Record<string, string>;

  /**
   * API gateway request timeout time, the default is 3000 milliseconds.
   */
  timeout?: number;

  /**
   * API gateway socket options.
   */
  socketOptions?: SocketOptions;
}

/**
 * API gateway.
 *
 * @param options API gateway options.
 */
export const gateway = ({
  appKey,
  appSecret,
  stage = 'RELEASE',
  timeout = 3000,
  ...args
}: GatewayOptions) => {
  const options = {appKey, appSecret, stage, timeout, ...args};

  return Object.freeze({
    request: initRequest(options),
    socket: initSocket(options)(),
    headers,
  });
};
