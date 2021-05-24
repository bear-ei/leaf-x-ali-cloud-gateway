import {FetchOptions} from '@leaf-x/fetch';
import {GatewayOptions} from './gateway.interface';

/**
 * Socket options.
 */
export interface SocketOptions {
  /**
   * Sign up path.
   */
  signUpPath: string;

  /**
   * Sign out path.
   */
  signOutPath: string;

  /**
   * Socket host.
   */
  host: string;

  /**
   * Socket protocol.
   *
   * Default: wss
   */
  protocol?: 'wss' | 'ws';

  /**
   * Socket port.
   *
   * Default: 8080
   */
  port?: number;

  /**
   * Device ID.
   */
  deviceId?: string;
}

/**
 * Initialize the socket.
 *
 * @param options GatewayOptions
 * @return Socket
 */
export interface InitSocket {
  (options: GatewayOptions): Socket;
}

/**
 * Socket result.
 */
export interface SocketResult {
  /**
   * Socket connect.
   */
  readonly connect: () => void;

  /**
   * Socket reconnect.
   */
  readonly reconnect: () => void;

  /**
   * Socket close.
   */
  readonly close: () => void;

  /**
   * Listening for socket events.
   */
  readonly on: (event: 'message', callback: Function) => void;

  readonly emit: (event: 'message', ...args: unknown[]) => void;
}

/**
 * Socket API.
 *
 * @return SocketResult
 */
export interface Socket {
  (): SocketResult;
}

/**
 * Initialize the socket request.
 *
 * @param options GatewayOptions
 * @return SocketRequest
 */
export interface InitSocketRequest {
  (options: GatewayOptions): SocketRequest;
}

/**
 * Socket request options.
 *
 * @extends FetchOptions
 */
export interface SocketRequestOptions extends FetchOptions {
  /**
   * Request host.
   */
  host: string;

  /**
   * Socket sequence.
   */
  seq: number;

  /**
   * Request type.
   */
  type: 'UNREGISTER' | 'REGISTER';

  /**
   * Socket protocol.
   */
  protocol: 'ws' | 'wss';
}

/**
 * Socket request.
 *
 * @param url Request URL.
 * @param options SocketRequestOptions
 * @return string
 */
export interface SocketRequest {
  (url: string, options: SocketRequestOptions): string;
}
