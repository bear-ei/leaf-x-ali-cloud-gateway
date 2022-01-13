import fetch, {FetchOptions} from '@leaf-x/fetch';
import {handleDefaults} from './defaults';
import {initRequest} from './request';
import {initSocket, SocketOptions} from './socket';

/**
 * API gateway options.
 */
export interface GatewayOptions {
  /**
   * API gateway authorization application key.
   */
  appKey: string;

  /**
   * API gateway authorization application secret key.
   */
  appSecret: string;

  /**
   * API gateway deployment environment.
   */
  stage?: 'RELEASE' | 'PRE' | 'TEST';

  /**
   * Request header information.
   *
   * The default 'content-type' is 'application/json; charset=utf-8'.
   */
  headers?: FetchOptions['headers'];

  /**
   * Request timeout time.
   *
   * The default value is 3000 milliseconds.
   */
  timeout?: number;

  /**
   * API gateway socket options.
   */
  socketOptions?: SocketOptions;

  /**
   * Request base URL.
   *
   * BaseURL` will be automatically prepended to `url`, unless `url` is an
   * absolute URL.
   */
  baseUrl?: string;
}

/**
 * API gateway type.
 */
type GatewayType = typeof relGateway & {
  defaults: typeof handleDefaults;
};

/**
 * API gateway.
 *
 * @param options API gateway options.
 */
const relGateway = ({
  appKey,
  appSecret,
  stage = 'RELEASE',
  timeout = 3000,
  baseUrl,
  ...args
}: GatewayOptions) => {
  const options = {appKey, appSecret, stage, timeout, ...args};

  baseUrl && fetch.defaults({baseUrl});

  return Object.freeze({
    request: initRequest(options),
    socket: initSocket(options),
  });
};

/**
 * Defines the request default parameter settings.
 */
Object.defineProperty(relGateway, 'defaults', {
  value: handleDefaults,
});

export const gateway = relGateway as GatewayType;
